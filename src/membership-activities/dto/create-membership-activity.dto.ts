import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { now } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export class CreateMembershipActivityDto {
  chapterId: object;
  userId: object;

  @ApiProperty({
    example: 'Id del Usuario Networker.',
  })
  @IsNotEmpty()
  @IsString()
  networkerName: string;

  @ApiProperty({
    example: 'Fecha inicio.',
  })
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @ApiProperty({
    example: 'Fecha fin.',
  })
  @IsNotEmpty()
  @IsString()
  endDate: string;

  concatDate: string;

  @ApiProperty({
    example: 'Actividad.',
  })
  @IsNotEmpty()
  @IsString()
  activity: string;

  @ApiProperty({
    example: 'Comentarios.',
  })
  @IsString()
  comments: string;

  @Prop({ default: EstatusRegister.Pending, required: false })
  statusActivity?: string;

  @Prop({ default: now(), required: false })
  createdAt?: Date;

  @Prop({ default: EstatusRegister.Active, required: false })
  status?: string;
}
