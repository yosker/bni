import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { now } from 'mongoose';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { EstatusRegister } from 'src/shared/enums/register.enum';
export class AttendanceDTO extends PartialType(RegisterAuthDto) {
  @ApiProperty({
    example: 'Id del Capitulo.',
  })
  @IsNotEmpty()
  @IsString()
  chapterId: object;

  chapterSessionId: object;

  userId: object;

  @Prop({ default: false, required: false })
  attended: boolean;

  @ApiProperty({
    example: 'Tipo de asistencia.',
  })
  @IsNotEmpty()
  @IsString()
  attendanceType: string;

  attendanceDate: string;

  @Prop({ default: now(), required: false })
  createdAt?: Date;

  @Prop({ default: EstatusRegister.Active, required: false })
  status?: string;
}
