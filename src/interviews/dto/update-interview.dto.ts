import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateInterviewDto } from './create-interview.dto';

export class UpdateInterviewDto extends PartialType(CreateInterviewDto) {
  @ApiProperty({
    example: 'Id registro.',
  })
  @IsNotEmpty()
  _id: object;
}
