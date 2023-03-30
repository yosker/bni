import { Prop } from '@nestjs/mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { EstatusRegister } from 'src/shared/enums/register.enum';
import { CreateNonAttendanceDto } from './create-non-attendance.dto';

export class UpdateNonAttendanceDto extends PartialType(
  CreateNonAttendanceDto,
) {
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

  @Prop({ default: new Date().toISOString(), required: false })
  updatedAt?: string;

  @Prop({ default: EstatusRegister.Active, required: false })
  status?: string;
}
