/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Chapter } from './interfaces/chapters.interface';
import { CreateChapterDTO } from './dto/chapters.dto';
import { ServicesResponse } from '../responses/response';
import { User } from 'src/users/interfaces/users.interface';
import { Users } from 'src/users/schemas/users.schema';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { hash } from 'bcrypt';
import { SharedService } from 'src/shared/shared.service';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { EmailProperties } from 'src/shared/emailProperties';
import { Response } from 'express';

const ObjectId = require('mongodb').ObjectId;
@Injectable()
export class ChaptersService {
  constructor(
    @InjectModel('Chapter') private readonly chapterModel: Model<Chapter>,
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    private readonly sharedService: SharedService,
    private servicesResponse: ServicesResponse,
  ) {}

  async getChapters() {
    const chapters = this.chapterModel.find();
    return chapters;
  }

  async getChapter(chapterId: string) {
    const chapter = this.chapterModel.findById(chapterId);
    return chapter;
  }

  async create(
    createChapterDTO: CreateChapterDTO,
    res: Response,
  ): Promise<Response> {
    const { result } = this.servicesResponse;

    const chapter: Chapter = new this.chapterModel(createChapterDTO);
    try {
      const newChapter = await chapter.save();

      let createUserDto: RegisterAuthDto = {
        idChapter: ObjectId(newChapter._id),
        name: createChapterDTO.name,
        email: createChapterDTO.email,
        password: await this.sharedService.passwordGenerator(6),
        role: 'Presidente',
      };
      const { password } = createUserDto;

      //OBJETO PARA EL CORREO
      const emailProperties: EmailProperties = {
        email: createChapterDTO.email,
        password: password,
        name: createChapterDTO.name,
        template: process.env.CHAPTERS_WELCOME,
        subject: process.env.SUBJECT_CHAPTER_WELCOME,
        urlPlatform: '',
        amount: '',
      };

      const plainToHash = await hash(password, 10);
      createUserDto = { ...createUserDto, password: plainToHash };
      const newUser = await this.usersModel.create(createUserDto);

      if (newChapter != null && newUser != null)
        await this.sharedService.sendEmail(emailProperties);

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: result,
      });
    } catch (err) {
      if (err.code === 11000) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(new HttpException('RECORD_DUPLICATED.', HttpStatus.CONFLICT));
      } else {
        throw res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json(
            new HttpException(
              'INTERNAL_SERVER_ERROR.',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
      }
    }
  }

  async updateChapter(
    chapterId: string,
    createChapterDTO: CreateChapterDTO,
    res: Response,
  ): Promise<Response> {
    const chapterUpdated = this.chapterModel.findByIdAndUpdate(
      chapterId,
      createChapterDTO,
      { new: true },
    );
    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: chapterUpdated,
    });
  }
}
