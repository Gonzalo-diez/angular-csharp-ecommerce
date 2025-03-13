using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class updatePayments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InvoiceDetail_Invoices_InvoiceId",
                table: "InvoiceDetail");

            migrationBuilder.DropColumn(
                name: "FacturaId",
                table: "InvoiceDetail");

            migrationBuilder.RenameColumn(
                name: "InvoiceId",
                table: "InvoiceDetail",
                newName: "invoiceId");

            migrationBuilder.RenameIndex(
                name: "IX_InvoiceDetail_InvoiceId",
                table: "InvoiceDetail",
                newName: "IX_InvoiceDetail_invoiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_InvoiceDetail_Invoices_invoiceId",
                table: "InvoiceDetail",
                column: "invoiceId",
                principalTable: "Invoices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InvoiceDetail_Invoices_invoiceId",
                table: "InvoiceDetail");

            migrationBuilder.RenameColumn(
                name: "invoiceId",
                table: "InvoiceDetail",
                newName: "InvoiceId");

            migrationBuilder.RenameIndex(
                name: "IX_InvoiceDetail_invoiceId",
                table: "InvoiceDetail",
                newName: "IX_InvoiceDetail_InvoiceId");

            migrationBuilder.AddColumn<int>(
                name: "FacturaId",
                table: "InvoiceDetail",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_InvoiceDetail_Invoices_InvoiceId",
                table: "InvoiceDetail",
                column: "InvoiceId",
                principalTable: "Invoices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
