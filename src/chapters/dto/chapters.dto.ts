import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsNumber, IsEmail } from 'class-validator';
import { extend } from 'joi';
import { now } from "mongoose";
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';

export class CreateChapterDTO extends PartialType(RegisterAuthDto) {

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsString()
    region: string;

    @IsNotEmpty()
    @IsString()
    chapterName: string;

    @IsNotEmpty()
    @IsString()
    sessionDate: string;

    @IsNotEmpty()
    @IsString()
    sessionSchedule: string;

    @IsNotEmpty()
    @IsString()
    sessionType: string;

    @Prop({ default: now() })
    createdAt: Date;

    @Prop({ default: "Active", required: false })
    status?: string;
}

