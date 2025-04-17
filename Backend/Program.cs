using Backend.Data;
using Backend.Interfaces;
using Backend.Services;
using Backend.Repositories;
using Backend.Repositories.Interfaces;
using Backend.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Filters;
using System.Text;
using dotenv.net;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// ✅ Cargar variables de entorno desde .env (opcional)
DotEnv.Load();

// ✅ Obtener conexión a PostgreSQL desde appsettings.json o variables de entorno
var dbConnection = Environment.GetEnvironmentVariable("DB_CONNECTION") ?? configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrEmpty(dbConnection))
{
    throw new InvalidOperationException("La conexión a la base de datos no está configurada.");
}

// ✅ Configurar DbContext con PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(dbConnection));

// ✅ Configurar autenticación con JWT
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(IdentityRoles.Admin, policy => policy.RequireRole(IdentityRoles.Admin));
    options.AddPolicy(IdentityRoles.Premium, policy => policy.RequireRole(IdentityRoles.Premium));
    options.AddPolicy("AdminOrPremium", policy => policy.RequireRole(IdentityRoles.Admin, IdentityRoles.Premium));
});

var jwtKey = configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key no está configurada.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
                if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
                {
                    context.Token = authHeader.Substring("Bearer ".Length);
                }
                return Task.CompletedTask;
            }
        };
    });

// ✅ Habilitar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
        builder.WithOrigins(
            "http://localhost:4200",
            "http://192.168.1.6:5173"
            )
               .AllowAnyMethod()
               .AllowAnyHeader());
});

// 📌 **Registrar los servicios y repositorios**
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();

builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();

builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<ICartRepository, CartRepository>();

builder.Services.AddScoped<IPurchaseService, PurchaseService>();
builder.Services.AddScoped<IPurchaseRepository, PurchaseRepository>();

builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();

builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IPdfService, PdfService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// ✅ Agregar controladores y Swagger
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
    })
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

builder.Services.AddHttpContextAccessor();
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Services.AddSignalR();

var app = builder.Build();

// ✅ Middleware de manejo global de errores
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";

        var error = context.Features.Get<IExceptionHandlerFeature>();
        if (error != null)
        {
            var errorResponse = new { error = error.Error.Message };
            Console.WriteLine($"❌ ERROR: {error.Error.Message}");
            await context.Response.WriteAsJsonAsync(errorResponse);
        }
    });
});

// ✅ Configurar Swagger solo en modo desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();

// ✅ Middleware de autenticación, autorización y CORS
app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapHub<Backend.Hubs.AuthHub>("/authHub");
app.MapHub<Backend.Hubs.CartHub>("/cartHub");
app.MapHub<Backend.Hubs.ProductHub>("/productHub");
app.MapControllers();

// ✅ Middleware para imprimir el token recibido (solo para depuración)
app.Use(async (context, next) =>
{
    var token = context.Request.Headers["Authorization"];
    Console.WriteLine($"🛠 Token recibido en la petición: {token}");
    await next();
});

app.Run();
