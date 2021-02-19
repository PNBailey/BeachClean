using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace api.Data.Migrations
{
    public partial class EventEntityAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EventId",
                table: "Photo",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    EventCreatorId = table.Column<int>(type: "INTEGER", nullable: false),
                    EventName = table.Column<string>(type: "TEXT", nullable: true),
                    EventDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EventLocation = table.Column<string>(type: "TEXT", nullable: true),
                    MainPhotoId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Events_Photo_MainPhotoId",
                        column: x => x.MainPhotoId,
                        principalTable: "Photo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Events_Users_EventCreatorId",
                        column: x => x.EventCreatorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppUserEvent",
                columns: table => new
                {
                    OgranisedEventsId = table.Column<int>(type: "INTEGER", nullable: false),
                    OrganisersId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserEvent", x => new { x.OgranisedEventsId, x.OrganisersId });
                    table.ForeignKey(
                        name: "FK_AppUserEvent_Events_OgranisedEventsId",
                        column: x => x.OgranisedEventsId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppUserEvent_Users_OrganisersId",
                        column: x => x.OrganisersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppUserEvent1",
                columns: table => new
                {
                    AttendeesId = table.Column<int>(type: "INTEGER", nullable: false),
                    AttendingEventsId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserEvent1", x => new { x.AttendeesId, x.AttendingEventsId });
                    table.ForeignKey(
                        name: "FK_AppUserEvent1_Events_AttendingEventsId",
                        column: x => x.AttendingEventsId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppUserEvent1_Users_AttendeesId",
                        column: x => x.AttendeesId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Photo_EventId",
                table: "Photo",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_AppUserEvent_OrganisersId",
                table: "AppUserEvent",
                column: "OrganisersId");

            migrationBuilder.CreateIndex(
                name: "IX_AppUserEvent1_AttendingEventsId",
                table: "AppUserEvent1",
                column: "AttendingEventsId");

            migrationBuilder.CreateIndex(
                name: "IX_Events_EventCreatorId",
                table: "Events",
                column: "EventCreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_Events_MainPhotoId",
                table: "Events",
                column: "MainPhotoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photo_Events_EventId",
                table: "Photo",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photo_Events_EventId",
                table: "Photo");

            migrationBuilder.DropTable(
                name: "AppUserEvent");

            migrationBuilder.DropTable(
                name: "AppUserEvent1");

            migrationBuilder.DropTable(
                name: "Events");

            migrationBuilder.DropIndex(
                name: "IX_Photo_EventId",
                table: "Photo");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "Photo");
        }
    }
}
