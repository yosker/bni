import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @Prop({ default: new Date() })
  createdAt: Date;
}
