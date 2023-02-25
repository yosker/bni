import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  UseGuards,
  Res,
  UploadedFile,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { MembershipActivitiesService } from './membership-activities.service';
import { UpdateMembershipActivityDto } from './dto/update-membership-activity.dto';
import { Response } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JWTPayload } from 'src/auth/jwt.payload';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMembershipActivityDto } from './dto/create-membership-activity.dto';

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
    @Res() res: Response,
    @Request() createMembershipActivityDto: CreateMembershipActivityDto,
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
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() updateMembershipActivityDto: UpdateMembershipActivityDto,
    @Res() res: Response,
  ) {
    return this.membershipActivitiesService.update(
      id,
      updateMembershipActivityDto,
      file.buffer,
      file.originalname,
      res,
    );
  }
}
