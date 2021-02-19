using Microsoft.EntityFrameworkCore.Migrations;

namespace api.Data.Migrations
{
    public partial class EventEntityUpdated : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_Users_EventCreatorId",
                table: "Events");

            migrationBuilder.RenameColumn(
                name: "EventName",
                table: "Events",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "EventLocation",
                table: "Events",
                newName: "Location");

            migrationBuilder.RenameColumn(
                name: "EventDate",
                table: "Events",
                newName: "Date");

            migrationBuilder.RenameColumn(
                name: "EventCreatorId",
                table: "Events",
                newName: "CreatorId");

            migrationBuilder.RenameIndex(
                name: "IX_Events_EventCreatorId",
                table: "Events",
                newName: "IX_Events_CreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Users_CreatorId",
                table: "Events",
                column: "CreatorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_Users_CreatorId",
                table: "Events");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Events",
                newName: "EventName");

            migrationBuilder.RenameColumn(
                name: "Location",
                table: "Events",
                newName: "EventLocation");

            migrationBuilder.RenameColumn(
                name: "Date",
                table: "Events",
                newName: "EventDate");

            migrationBuilder.RenameColumn(
                name: "CreatorId",
                table: "Events",
                newName: "EventCreatorId");

            migrationBuilder.RenameIndex(
                name: "IX_Events_CreatorId",
                table: "Events",
                newName: "IX_Events_EventCreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Users_EventCreatorId",
                table: "Events",
                column: "EventCreatorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
