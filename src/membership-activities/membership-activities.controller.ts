import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  UseGuards,
  Res,
  UploadedFile,
  UseInterceptors,
  Body,
  Request
} from '@nestjs/common';
import { MembershipActivitiesService } from './membership-activities.service';
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
    @Body() createMembershipActivityDto: CreateMembershipActivityDto,
    @Auth() jwtPayload: JWTPayload,
  ) {
    return this.membershipActivitiesService.create(
      createMembershipActivityDto,
      jwtPayload,
      res,
    );
  }

  @Get('/list/:date')
  findAll(
    @Param('date') date: string,
    @Auth() jwtPayload: JWTPayload,
    @Res() res: Response,
  ) {
    return this.membershipActivitiesService.findAll(jwtPayload, date, res);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.membershipActivitiesService.findOne(id, res);
  }

  @Patch('updateFile/:id')
  @UseInterceptors(FileInterceptor('file'))
  updateActivityByUser(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Res() res: Response,
  ) {
    return this.membershipActivitiesService.fileUpdate(
      id,
      req.body,
      file.buffer,
      file.originalname,
      res,
    );
  }

  @Get('/findDates/date')
  findActivitiesByDate(@Auth() jwtPayload: JWTPayload, @Res() res: Response) {
    return this.membershipActivitiesService.findDates(jwtPayload, res);
  }

  @Patch('/update/:id')
  async updateActivity(
    @Param('id') id: string,
    @Body() createMembershipActivityDto: CreateMembershipActivityDto,
    @Res() res: Response,
  ) {
    return await this.membershipActivitiesService.update(
      id,
      createMembershipActivityDto,
      res,
    );
  }

  @Patch('/delete/:id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    return await this.membershipActivitiesService.delete(id, res);
  }


  
  //SERVICIOS PARA LAS ACTIVIDADES DEL COMITE DE MEMBRESIAS (POR USUARIO)

  @Get('/activitiesByUser/:date')
  findAllActivitiesByUser(
    @Param('date') date: string,
    @Auth() jwtPayload: JWTPayload,
    @Res() res: Response,
  ) {
    return this.membershipActivitiesService.findUserActivities(jwtPayload, date, res);
  }




}
