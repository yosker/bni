import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstatusRegister } from 'src/shared/enums/register.enum';

const moment = require('moment-timezone');

export class MonitoringLettersDTO  {

    userId: object;
    @ApiProperty({
      example: 'Nombre del titular de tesorería.',
    })
    name: string;

    @ApiProperty({
      example: 'Id del visitante.',
    })
    @IsNotEmpty()
    visitorId: object;

    @ApiProperty({
      example: 'Comentarios',
    })
    @IsNotEmpty()
    @IsString()
    comment: string;
    
    @Prop({ default: moment().toISOString() })
    createdAt: string;
  
    @Prop({ default: EstatusRegister.Active, required: false })
    status?: string;
  }
  