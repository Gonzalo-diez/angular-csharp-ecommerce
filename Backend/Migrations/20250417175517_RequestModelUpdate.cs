using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class RequestModelUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ShippingData_CardNumber",
                table: "CheckoutRequest",
                type: "character varying(16)",
                maxLength: 16,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ShippingData_City",
                table: "CheckoutRequest",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ShippingData_FullName",
                table: "CheckoutRequest",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ShippingData_Phone",
                table: "CheckoutRequest",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ShippingData_SecurityCode",
                table: "CheckoutRequest",
                type: "character varying(3)",
                maxLength: 3,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ShippingData_ZipCode",
                table: "CheckoutRequest",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShippingData_CardNumber",
                table: "CheckoutRequest");

            migrationBuilder.DropColumn(
                name: "ShippingData_City",
                table: "CheckoutRequest");

            migrationBuilder.DropColumn(
                name: "ShippingData_FullName",
                table: "CheckoutRequest");

            migrationBuilder.DropColumn(
                name: "ShippingData_Phone",
                table: "CheckoutRequest");

            migrationBuilder.DropColumn(
                name: "ShippingData_SecurityCode",
                table: "CheckoutRequest");

            migrationBuilder.DropColumn(
                name: "ShippingData_ZipCode",
                table: "CheckoutRequest");
        }
    }
}
