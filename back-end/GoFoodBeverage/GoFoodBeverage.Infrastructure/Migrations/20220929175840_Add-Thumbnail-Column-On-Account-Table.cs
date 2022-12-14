using Microsoft.EntityFrameworkCore.Migrations;

namespace GoFoodBeverage.Infrastructure.Migrations
{
    public partial class AddThumbnailColumnOnAccountTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Thumbnail",
                table: "Account",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Thumbnail",
                table: "Account");
        }
    }
}
