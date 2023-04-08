import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseGuards,
    Res,
    UseInterceptors,
    UploadedFile,
    Request,
    Delete,
} from '@nestjs/common';

import { ChargesService } from './charges.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { JWTPayload } from 'src/auth/jwt.payload';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Response } from 'express';

@ApiTags('charges')
@Controller('charges')
export class ChargesController {
    constructor(private readonly chargesService: ChargesService) { }

    @ApiBearerAuth()
    @UseGuards(AuthGuard(), JwtGuard)
    @Post('/create')
    @UseInterceptors(FileInterceptor('file'))
    async create(
        @Auth() jwtPayload: JWTPayload,
        @Request() req,
        @UploadedFile() file: Express.Multer.File,
        @Res() res: Response
    ): Promise<Response> {
        return await this.chargesService.create(
            jwtPayload,
            req.body,
            file.buffer,
            file.originalname,
            res
        );
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard(), JwtGuard)
    @Get('/findAll')
    async findAll(
        @Auth() jwtPayload: JWTPayload,
        @Res() res: Response,
    ): Promise<Response> {
        return await this.chargesService.findAll(jwtPayload, res);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard(), JwtGuard)
    @Patch('/delete/:id')
    async Delete(
        @Param('id') id: string,
        @Res() res: Response,
    ): Promise<Response> {
        return await this.chargesService.delete(id, res);
    }


    @ApiBearerAuth()
    @UseGuards(AuthGuard(), JwtGuard)
    @Get('/findOne/:id')
    async findone(
        @Param('id') id: string,
        @Auth() jwtPayload: JWTPayload,
        @Res() res: Response,
    ): Promise<Response> {
        return await this.chargesService.findOne(id, jwtPayload, res);
    }


}