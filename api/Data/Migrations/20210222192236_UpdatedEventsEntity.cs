using Microsoft.EntityFrameworkCore.Migrations;

namespace api.Data.Migrations
{
    public partial class UpdatedEventsEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Events_EventId",
                table: "Photos");

            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Events_EventId1",
                table: "Photos");

            migrationBuilder.DropTable(
                name: "AppUserEvent");

            migrationBuilder.DropTable(
                name: "AppUserEvent1");

            migrationBuilder.DropIndex(
                name: "IX_Photos_EventId",
                table: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_Photos_EventId1",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "EventId1",
                table: "Photos");

            migrationBuilder.CreateTable(
                name: "UserEvents",
                columns: table => new
                {
                    OrganiserId = table.Column<int>(type: "INTEGER", nullable: false),
                    EventId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserEvents", x => new { x.OrganiserId, x.EventId });
                    table.ForeignKey(
                        name: "FK_UserEvents_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserEvents_Users_OrganiserId",
                        column: x => x.OrganiserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserEvents_EventId",
                table: "UserEvents",
                column: "EventId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserEvents");

            migrationBuilder.AddColumn<int>(
                name: "EventId",
                table: "Photos",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EventId1",
                table: "Photos",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppUserEvent",
                columns: table => new
                {
                    OrganisedEventsId = table.Column<int>(type: "INTEGER", nullable: false),
                    OrganisersId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserEvent", x => new { x.OrganisedEventsId, x.OrganisersId });
                    table.ForeignKey(
                        name: "FK_AppUserEvent_Events_OrganisedEventsId",
                        column: x => x.OrganisedEventsId,
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
                name: "IX_Photos_EventId",
                table: "Photos",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_Photos_EventId1",
                table: "Photos",
                column: "EventId1",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppUserEvent_OrganisersId",
                table: "AppUserEvent",
                column: "OrganisersId");

            migrationBuilder.CreateIndex(
                name: "IX_AppUserEvent1_AttendingEventsId",
                table: "AppUserEvent1",
                column: "AttendingEventsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Events_EventId",
                table: "Photos",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Events_EventId1",
                table: "Photos",
                column: "EventId1",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
