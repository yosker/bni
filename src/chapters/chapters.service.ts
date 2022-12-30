/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
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

  async createChapter(
    createChapterDTO: CreateChapterDTO,
  ): Promise<ServicesResponse> {
    const { status, message, result } = this.servicesResponse;

    const chapter: Chapter = new this.chapterModel(createChapterDTO);
    try {
      const newChapter = await chapter.save();

      let createUserDto: RegisterAuthDto = {
        idChapter: ObjectId(newChapter._id),
        name: createChapterDTO.name,
        email: createChapterDTO.email,
        password: await this.sharedService.passwordGenerator(6),
      };

      const { password } = createUserDto;
      console.log(password);
      const plainToHash = await hash(password, 10);
      createUserDto = { ...createUserDto, password: plainToHash };

      await this.usersModel.create(createUserDto);

      return { status, message, result };
    } catch (err) {
      if (err.code === 11000) {
        throw new HttpErrorByCode[409]('DUPLICATED_REGISTER');
      } else {
        throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
      }
    }
  }

  async updateChapter(chapterId: string, createChapterDTO: CreateChapterDTO) {
    const chapterUpdated = this.chapterModel.findByIdAndUpdate(
      chapterId,
      createChapterDTO,
      { new: true },
    );
    return chapterUpdated;
  }

  async deleteChapter(chapterId: string) {
    const deletedChapter = this.chapterModel.findByIdAndDelete(chapterId);
    return deletedChapter;
  }
}
