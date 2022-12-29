import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsNumber, IsEmail } from 'class-validator';
import {now } from "mongoose";

export class CreateChapterDTO {

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
 
    @Prop({default: now()})
    createdAt: Date;

    @Prop({default: "Active", required: false})
    status?: string;

    //PROPIEDADES PARA DAR DE ALTA UN USUARIO
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}

