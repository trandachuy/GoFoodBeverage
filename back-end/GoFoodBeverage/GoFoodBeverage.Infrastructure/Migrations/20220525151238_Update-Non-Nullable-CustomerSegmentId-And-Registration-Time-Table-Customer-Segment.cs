﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace GoFoodBeverage.Infrastructure.Migrations
{
    public partial class UpdateNonNullableCustomerSegmentIdAndRegistrationTimeTableCustomerSegment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomerSegmentCondition_CustomerSegment_CustomerSegmentId",
                table: "CustomerSegmentCondition");

            migrationBuilder.RenameColumn(
                name: "Time",
                table: "CustomerSegmentCondition",
                newName: "RegistrationTime");

            migrationBuilder.AlterColumn<Guid>(
                name: "CustomerSegmentId",
                table: "CustomerSegmentCondition",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_CustomerSegmentCondition_CustomerSegment_CustomerSegmentId",
                table: "CustomerSegmentCondition",
                column: "CustomerSegmentId",
                principalTable: "CustomerSegment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomerSegmentCondition_CustomerSegment_CustomerSegmentId",
                table: "CustomerSegmentCondition");

            migrationBuilder.RenameColumn(
                name: "RegistrationTime",
                table: "CustomerSegmentCondition",
                newName: "Time");

            migrationBuilder.AlterColumn<Guid>(
                name: "CustomerSegmentId",
                table: "CustomerSegmentCondition",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddForeignKey(
                name: "FK_CustomerSegmentCondition_CustomerSegment_CustomerSegmentId",
                table: "CustomerSegmentCondition",
                column: "CustomerSegmentId",
                principalTable: "CustomerSegment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
