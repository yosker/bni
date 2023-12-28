import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstatusRegister } from 'src/shared/enums/register.enum';

const moment = require('moment-timezone');

export class PresentationCalendarDTO  {

    
    chapterId: object;
   
    createdBy: string;

    @IsString()
    networkerId: object;
   
    @IsString()
    networkerName: string;
   
    @IsString()
    presentationDate: string;

    @IsString()
    comments: string;

    @Prop({ default: moment().toISOString() })
    createdAt: string;
  
    @Prop({ default: EstatusRegister.Active, required: false })
    status?: string;
  }
  