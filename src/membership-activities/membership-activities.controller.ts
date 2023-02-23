import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Res,
} from '@nestjs/common';
import { MembershipActivitiesService } from './membership-activities.service';
import { CreateMembershipActivityDto } from './dto/create-membership-activity.dto';
import { UpdateMembershipActivityDto } from './dto/update-membership-activity.dto';
import { Response } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JWTPayload } from 'src/auth/jwt.payload';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('Membership Activities')
@Controller('membership-activities')
export class MembershipActivitiesController {
  constructor(
    private readonly membershipActivitiesService: MembershipActivitiesService,
  ) {}

  @Post()
  create(
    @Body() createMembershipActivityDto: CreateMembershipActivityDto,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ) {
    return this.membershipActivitiesService.create(
      createMembershipActivityDto,
      jwtPayload,
      res,
    );
  }

  @Get()
  findAll(@Res() res: Response) {
    return this.membershipActivitiesService.findAll(res);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.membershipActivitiesService.findOne(id, res);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMembershipActivityDto: UpdateMembershipActivityDto,
    @Res() res: Response,
  ) {
    return this.membershipActivitiesService.update(
      +id,
      updateMembershipActivityDto,
      res,
    );
  }
}
