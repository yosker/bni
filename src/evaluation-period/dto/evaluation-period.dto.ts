import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { now } from 'mongoose';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { EstatusRegister } from 'src/shared/enums/register.enum';
import { Commitments } from '../interfaces/commitments.interface';

export class EvaluationPeriodDTO extends PartialType(RegisterAuthDto) {

    chapterId: object;
    
    @ApiProperty({
        example: 'Id del Networker.',
    })
    @IsNotEmpty()
    @IsString()
    networkerId: string;

    @ApiProperty({
        example: 'Nombre del Networker.',
    })
    @IsNotEmpty()
    @IsString()
    networkerName: string;

    @ApiProperty({
        example: 'Fecha inical del periodo.',
    })
    @IsNotEmpty()
    @IsString()
    initialPeriod: string;

    @ApiProperty({
        example: 'Fecha fina del periodo.',
    })
    @IsNotEmpty()
    @IsString()
    finalPeriod: string;

    @ApiProperty({
        example: 'Comentarios generales.',
    })
    
    @IsString()
    notes: string;

    @ApiProperty({
        example: 'Compromisos.',
    })
    @IsNotEmpty()
    commitments: Commitments;

    @Prop({ default: now(), required: false })
    createdAt?: Date;

    @Prop({ default: EstatusRegister.Active, required: false })
    status?: string;
}
