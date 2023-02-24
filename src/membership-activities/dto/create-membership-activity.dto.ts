import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { now } from "mongoose";
import { EstatusRegister } from "src/shared/enums/register.enum";

export class CreateMembershipActivityDto {
  userId: object;

  @ApiProperty({
    example: 'Id del Usuario Networker.',
  })
  @IsNotEmpty()
  @IsString()
  userNetworkerId: object;

  @ApiProperty({
    example: 'Tipo de asistencia.',
  })
  @IsNotEmpty()
  @IsBoolean()
  fileRequire: boolean;

  @ApiProperty({
    example: 'Comentarios.',
  })
  @IsNotEmpty()
  @IsString()
  comments: string;

  imageURL: string;

  @ApiProperty({
    example: 'Fecha inicio.',
  })
  @Prop({ default: '', required: true })
  startDate: string;

  @ApiProperty({
    example: 'Fecha fin.',
  })
  @Prop({ default: '', required: true })
  endDate: string;

  @Prop({ default: now(), required: false })
  createdAt?: Date;

  @Prop({ default: EstatusRegister.Active, required: false })
  status?: string;
}
