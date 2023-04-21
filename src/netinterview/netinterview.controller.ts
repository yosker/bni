import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    UseGuards,
    Res,
    Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { NetinterviewService } from './netinterview.service';
import { NetinterviewDTO } from './dto/netinterview.dto';
import { Response } from 'express';
import { JWTPayload } from 'src/auth/jwt.payload';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('Net Interview')
@Controller('netinterview')
export class NetinterviewController {

    constructor(private readonly netinterviewService: NetinterviewService) { }

    @Post('/create')
    async createInterviews(
        @Auth() jwtPayload: JWTPayload,
        @Body() netinterviewDTO: NetinterviewDTO,
        @Res() res: Response,
    ) {
        return await this.netinterviewService.createInterview(netinterviewDTO, jwtPayload, res);
    }

    @Get('/list/:id')
    findAll(@Param('id') id: string, @Res() res: Response) {
        return this.netinterviewService.findAll(id, res);
    }
    @Get('/findOneById/:interviewId')
    findOne(@Param('interviewId') interviewId: string, @Res() res: Response) {
        return this.netinterviewService.findOne(interviewId, res);
    }

    @Patch('/update/:interviewId')
    update(
        @Param('interviewId') interviewId: string,
        @Auth() jwtPayload: JWTPayload,
        @Body() netinterviewDTO: NetinterviewDTO,
        @Res() res: Response,
    ) {
        return this.netinterviewService.update(netinterviewDTO,interviewId, jwtPayload, res);
    }

    @Get('/createpdf/:interviewId')
    async pdf( @Param('interviewId') interviewId: string, @Res() res: Response) :Promise<void>{
        const buffer = await this.netinterviewService.createFile(interviewId); 

        res.set({
            'Content-Type':'application/pdf',
            'Content-Disposition':'attachment; filename-example.pdf',
            'Content-Length':buffer.length,
        })
        res.end(buffer);
    }
}
