using Microsoft.EntityFrameworkCore.Migrations;

namespace api.Data.Migrations
{
    public partial class updatedevents : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MainPhotoUrl",
                table: "Events",
                type: "TEXT",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MainPhotoUrl",
                table: "Events");
        }
    }
}
