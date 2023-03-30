import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export class ChapterSessionDTO extends PartialType(RegisterAuthDto) {
  @ApiProperty({
    example: 'Id del capitulo. 6419d3a580048dea06ab4203',
  })
  @IsNotEmpty()
  chapterId: object;

  @ApiProperty({
    example: 'Fecha de la sesión. 15-03-2023',
  })
  @IsNotEmpty()
  @IsString()
  sessionDate: Date;

  @Prop({ default: EstatusRegister.Active, required: false })
  status?: string;
}
