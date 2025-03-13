using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class paymentMethodsUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_CheckoutRequest_CheckoutRequestPaymentMethod",
                table: "Invoices");

            migrationBuilder.DropIndex(
                name: "IX_Invoices_CheckoutRequestPaymentMethod",
                table: "Invoices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CheckoutRequest",
                table: "CheckoutRequest");

            migrationBuilder.DropColumn(
                name: "CheckoutRequestPaymentMethod",
                table: "Invoices");

            migrationBuilder.AddColumn<int>(
                name: "CheckoutRequestId",
                table: "Invoices",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "CheckoutRequest",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_CheckoutRequest",
                table: "CheckoutRequest",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_CheckoutRequestId",
                table: "Invoices",
                column: "CheckoutRequestId");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_CheckoutRequest_CheckoutRequestId",
                table: "Invoices",
                column: "CheckoutRequestId",
                principalTable: "CheckoutRequest",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_CheckoutRequest_CheckoutRequestId",
                table: "Invoices");

            migrationBuilder.DropIndex(
                name: "IX_Invoices_CheckoutRequestId",
                table: "Invoices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CheckoutRequest",
                table: "CheckoutRequest");

            migrationBuilder.DropColumn(
                name: "CheckoutRequestId",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "CheckoutRequest");

            migrationBuilder.AddColumn<string>(
                name: "CheckoutRequestPaymentMethod",
                table: "Invoices",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CheckoutRequest",
                table: "CheckoutRequest",
                column: "PaymentMethod");

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_CheckoutRequestPaymentMethod",
                table: "Invoices",
                column: "CheckoutRequestPaymentMethod");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_CheckoutRequest_CheckoutRequestPaymentMethod",
                table: "Invoices",
                column: "CheckoutRequestPaymentMethod",
                principalTable: "CheckoutRequest",
                principalColumn: "PaymentMethod",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
