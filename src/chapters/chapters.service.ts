import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Chapter } from './interfaces/chapters.interface'
import { CreateChapterDTO } from './dto/chapters.dto'
import { ServicesResponse } from '../responses/response'
import { User } from 'src/users/interfaces/users.interface';
import { Users } from 'src/users/schemas/users.schema';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { hash } from 'bcrypt';
import { SharedService } from 'src/shared/shared.service';

const ObjectId = require('mongodb').ObjectId;
@Injectable()
export class ChaptersService {

    constructor(
        @InjectModel('Chapter') private readonly chapterModel: Model<Chapter>,
        @InjectModel(Users.name) private readonly usersModel: Model<User>,
        private readonly sharedService: SharedService) { }

    async getChapters(): Promise<Chapter[]> {
        const chapters = await this.chapterModel.find();
        return chapters;
    }

    async getChapter(chapterId: string): Promise<Chapter> {
        const chapter = await this.chapterModel.findById(chapterId);
        return chapter;
    }

    async createChapter(createChapterDTO: CreateChapterDTO): Promise<ServicesResponse> {

        let response = new ServicesResponse;
        let status = 0;
        let message = '';
        let result = {};

        const chapter: Chapter = new this.chapterModel(createChapterDTO);
        try {
            const newChapter = await chapter.save();

            let createUserDto: RegisterAuthDto = {
                idChapter: ObjectId(newChapter._id),
                name: createChapterDTO.name,
                email: createChapterDTO.email,
                password: await this.sharedService.passwordGenerator(6)
            }

            const { password } = createUserDto;
            const plainToHash = await hash(password, 10);
            createUserDto = { ...createUserDto, password: plainToHash };

            await this.usersModel.create(createUserDto);
            status = 200;
            message = "OK";
        }
        catch (err) {
            if (err.code === 11000) {
                status = 401;
                message = "Duplicated";
            } else {
                status = 500;
                message = err.message;
            }
        }
        response.status = status;
        response.message = message;
        response.result = result;
        return response;
    }

    async updateChapter(chapterId: string, createChapterDTO: CreateChapterDTO): Promise<Chapter> {
        const chapterUpdated = await this.chapterModel.findByIdAndUpdate(chapterId, createChapterDTO, { new: true });
        return chapterUpdated;
    }

    async deleteChapter(chapterId: string): Promise<Chapter> {
        const deletedChapter = await this.chapterModel.findByIdAndDelete(chapterId);
        return deletedChapter;
    }

}
