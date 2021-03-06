﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using api.Data;

namespace api.Data.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20210221191120_FixingError")]
    partial class FixingError
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "5.0.0");

            modelBuilder.Entity("AppUserEvent", b =>
                {
                    b.Property<int>("OrganisedEventsId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("OrganisersId")
                        .HasColumnType("INTEGER");

                    b.HasKey("OrganisedEventsId", "OrganisersId");

                    b.HasIndex("OrganisersId");

                    b.ToTable("AppUserEvent");
                });

            modelBuilder.Entity("AppUserEvent1", b =>
                {
                    b.Property<int>("AttendeesId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("AttendingEventsId")
                        .HasColumnType("INTEGER");

                    b.HasKey("AttendeesId", "AttendingEventsId");

                    b.HasIndex("AttendingEventsId");

                    b.ToTable("AppUserEvent1");
                });

            modelBuilder.Entity("api.Entities.AppUser", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("Created")
                        .HasColumnType("TEXT");

                    b.Property<string>("EmailAddress")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("LastActive")
                        .HasColumnType("TEXT");

                    b.Property<string>("Location")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<string>("Occupation")
                        .HasColumnType("TEXT");

                    b.Property<byte[]>("PasswordHash")
                        .HasColumnType("BLOB");

                    b.Property<byte[]>("PasswordSalt")
                        .HasColumnType("BLOB");

                    b.Property<string>("UserName")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("api.Entities.Event", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("CreatorId")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("Date")
                        .HasColumnType("TEXT");

                    b.Property<string>("Location")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("CreatorId");

                    b.ToTable("Events");
                });

            modelBuilder.Entity("api.Entities.Photo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("AppUserId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("EventId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("EventId1")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Url")
                        .HasColumnType("TEXT");

                    b.Property<string>("publicId")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("AppUserId")
                        .IsUnique();

                    b.HasIndex("EventId");

                    b.HasIndex("EventId1")
                        .IsUnique();

                    b.ToTable("Photos");
                });

            modelBuilder.Entity("api.Entities.UserLike", b =>
                {
                    b.Property<int>("SourceUserId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("LikedUserId")
                        .HasColumnType("INTEGER");

                    b.HasKey("SourceUserId", "LikedUserId");

                    b.HasIndex("LikedUserId");

                    b.ToTable("Likes");
                });

            modelBuilder.Entity("AppUserEvent", b =>
                {
                    b.HasOne("api.Entities.Event", null)
                        .WithMany()
                        .HasForeignKey("OrganisedEventsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("api.Entities.AppUser", null)
                        .WithMany()
                        .HasForeignKey("OrganisersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AppUserEvent1", b =>
                {
                    b.HasOne("api.Entities.AppUser", null)
                        .WithMany()
                        .HasForeignKey("AttendeesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("api.Entities.Event", null)
                        .WithMany()
                        .HasForeignKey("AttendingEventsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("api.Entities.Event", b =>
                {
                    b.HasOne("api.Entities.AppUser", "Creator")
                        .WithMany("CreatedEvents")
                        .HasForeignKey("CreatorId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Creator");
                });

            modelBuilder.Entity("api.Entities.Photo", b =>
                {
                    b.HasOne("api.Entities.AppUser", "AppUser")
                        .WithOne("Photo")
                        .HasForeignKey("api.Entities.Photo", "AppUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("api.Entities.Event", "Event")
                        .WithMany("EventPhotos")
                        .HasForeignKey("EventId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("api.Entities.Event", null)
                        .WithOne("MainPhoto")
                        .HasForeignKey("api.Entities.Photo", "EventId1");

                    b.Navigation("AppUser");

                    b.Navigation("Event");
                });

            modelBuilder.Entity("api.Entities.UserLike", b =>
                {
                    b.HasOne("api.Entities.AppUser", "LikedUser")
                        .WithMany("LikedByUsers")
                        .HasForeignKey("LikedUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("api.Entities.AppUser", "SourceUser")
                        .WithMany("LikedUsers")
                        .HasForeignKey("SourceUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("LikedUser");

                    b.Navigation("SourceUser");
                });

            modelBuilder.Entity("api.Entities.AppUser", b =>
                {
                    b.Navigation("CreatedEvents");

                    b.Navigation("LikedByUsers");

                    b.Navigation("LikedUsers");

                    b.Navigation("Photo");
                });

            modelBuilder.Entity("api.Entities.Event", b =>
                {
                    b.Navigation("EventPhotos");

                    b.Navigation("MainPhoto");
                });
#pragma warning restore 612, 618
        }
    }
}
