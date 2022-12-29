import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Chapter } from './interfaces/chapters.interface'
import { CreateChapterDTO } from './dto/chapters.dto'
import { ServicesResponse } from '../responses/response'
import { User } from 'src/users/interfaces/users.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Users } from 'src/users/schemas/users.schema';

@Injectable()
export class ChaptersService {

    constructor(
        @InjectModel('Chapter') private readonly chapterModel: Model<Chapter>,
        @InjectModel(Users.name) private readonly usersModel: Model<User>,) { }

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

        const chapter = new this.chapterModel(createChapterDTO);
        try {
            const newChapter = await chapter.save();

            const createUserDto: CreateUserDto = {
                idChapter: newChapter._id,
                roleName: 'Presidente',
                name: createChapterDTO.userName,
                lastName: createChapterDTO.lastName,
                phoneNumber: ' ',
                email: createChapterDTO.email,
                password: "123456",
                imageURL: ' ',
                companyName: ' ',
                profession: ' ',
                status: 1,
                createdAt: new Date()
            }
            const user = await this.usersModel.create(createUserDto);
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
