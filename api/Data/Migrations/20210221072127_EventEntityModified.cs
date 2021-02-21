using Microsoft.EntityFrameworkCore.Migrations;

namespace api.Data.Migrations
{
    public partial class EventEntityModified : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUserEvent_Events_OgranisedEventsId",
                table: "AppUserEvent");

            migrationBuilder.RenameColumn(
                name: "OgranisedEventsId",
                table: "AppUserEvent",
                newName: "OrganisedEventsId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserEvent_Events_OrganisedEventsId",
                table: "AppUserEvent",
                column: "OrganisedEventsId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUserEvent_Events_OrganisedEventsId",
                table: "AppUserEvent");

            migrationBuilder.RenameColumn(
                name: "OrganisedEventsId",
                table: "AppUserEvent",
                newName: "OgranisedEventsId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserEvent_Events_OgranisedEventsId",
                table: "AppUserEvent",
                column: "OgranisedEventsId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
