using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Auth> Users { get; set; }

        public DbSet<Product> Products { get; set; }

        public DbSet<Cart> Carts { get; set; }

        public DbSet<Purchase> Purchases { get; set; }

        public DbSet<Invoice> Invoices { get; set; }

        public DbSet<BrowsingHistory> BrowsingHistories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Índices en Auth (Users)
            modelBuilder.Entity<Auth>()
                .HasIndex(a => a.Email)
                .IsUnique();

            modelBuilder.Entity<Auth>()
                .HasIndex(a => a.LastName);

            // Índices en Product
            modelBuilder.Entity<Product>()
                .HasIndex(p => p.Name);

            modelBuilder.Entity<Product>()
                .HasIndex(p => p.Category);

            modelBuilder.Entity<Product>()
                .HasIndex(p => p.Price);

            // Índices en Cart
            modelBuilder.Entity<Cart>()
                .HasIndex(c => c.UserId);

            // Índices en Purchase
            modelBuilder.Entity<Purchase>()
                .HasIndex(p => new { p.UserId, p.PurchaseDate });

            // Índices en Invoice
            modelBuilder.Entity<Invoice>()
                .HasIndex(i => i.UserId);

            modelBuilder.Entity<Invoice>()
                .HasIndex(i => i.Id)
                .IsUnique();

            modelBuilder.Entity<Invoice>()
                .HasIndex(i => i.Date);

            // Índices en BrowsingHistory
            modelBuilder.Entity<BrowsingHistory>()
                .HasIndex(bh => new { bh.UserId, bh.ProductId });
        }

    }
}