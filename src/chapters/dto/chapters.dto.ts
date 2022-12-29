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

    @Prop({default:1, required: false})
    status?: number;

    //PROPIEDADES PARA DAR DE ALTA UN USUARIO
    @IsNotEmpty()
    @IsString()
    userName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}

