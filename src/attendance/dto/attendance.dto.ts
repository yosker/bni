import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export class AttendanceDTO extends PartialType(RegisterAuthDto) {
  chapterId: object;

  chapterSessionId: object;

  @ApiProperty({
    example: 'Id de Usuario.',
  })
  @IsNotEmpty()
  @IsString()
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

  @Prop({ default: false, required: false })
  letterSent: boolean;

  @Prop({ default: new Date().toISOString(), required: false })
  updatedAt?: string;

  @Prop({ default: EstatusRegister.Active, required: false })
  status?: string;
}
