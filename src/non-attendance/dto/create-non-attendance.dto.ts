import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export class CreateNonAttendanceDto {
  chapterId: object;

  @ApiProperty({
    example: 'Id del Usuario.',
  })
  @IsNotEmpty()
  @IsString()
  userId: object;

  @ApiProperty({
    example: 'Tipo de asistencia.',
  })
  @IsNotEmpty()
  @IsString()
  attendanceType: string;

  @ApiProperty({
    example: 'Fecha de asistencia.',
  })
  @Prop({ default: '', required: false })
  attendanceDate: string;

  @Prop({ default: new Date(), required: false })
  createdAt?: Date;

  @Prop({ default: EstatusRegister.Active, required: false })
  status?: string;
}
