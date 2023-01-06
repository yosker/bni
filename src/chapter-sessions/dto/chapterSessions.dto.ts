import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ChapterSessionDTO extends PartialType(RegisterAuthDto) {
    @ApiProperty({
        example: 'Id del capitulo.',
    })
    @IsNotEmpty()
    chapterId: object;

    @ApiProperty({
        example: 'Fecha de la sesión.',
    })
    @IsNotEmpty()
    @IsString()
    sessionDate: string;

    @ApiProperty({
        example: 'Estatus del Registro.',
    })
    @Prop({ default: 'Active', required: false })
    status?: string;
}
