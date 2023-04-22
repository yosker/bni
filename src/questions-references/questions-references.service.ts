import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuestionsReferenceDto } from './dto/create-questions-reference.dto';
import { UpdateQuestionsReferenceDto } from './dto/update-questions-reference.dto';
import { ServicesResponse } from 'src/responses/response';
import { QuestionsReferences } from './schemas/questions-references.schema';
import { IQuestionsReference } from './interfaces/questions-references.interface';
import { User } from 'src/users/interfaces/users.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from 'src/users/schemas/users.schema';
import { IReference } from 'src/references/interfaces/references.interface';
import { References } from 'src/references/schemas/references.schema';
import { Response } from 'express';
import { PaginateResult } from 'src/shared/pagination/pagination-result';
import { join } from 'path';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

const ObjectId = require('mongodb').ObjectId;
const PDFDocument = require('pdfkit-table');

@Injectable()
export class QuestionsReferencesService {
  constructor(
    private servicesResponse: ServicesResponse,
    @InjectModel(QuestionsReferences.name)
    private readonly questionsReferenceModel: Model<IQuestionsReference>,
    @InjectModel(References.name)
    private readonly referenceModel: Model<IReference>,
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    private readonly paginateResult: PaginateResult,
  ) { }

  async create(
    createQuestionsReferenceDto: CreateQuestionsReferenceDto,
    res: Response,
  ) {
    try {
      createQuestionsReferenceDto.interviewId = ObjectId(
        createQuestionsReferenceDto.interviewId,
      );
      createQuestionsReferenceDto.userInterviewId = ObjectId(
        createQuestionsReferenceDto.userInterviewId,
      );

      createQuestionsReferenceDto.referenceId = ObjectId(
        createQuestionsReferenceDto.referenceId,
      );

      const reference = await this.referenceModel.findOne({
        _id: createQuestionsReferenceDto.referenceId,
        interviewId: createQuestionsReferenceDto.interviewId,
        userInterviewId: createQuestionsReferenceDto.userInterviewId,
      });

      if (!reference) {
        throw res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException(
              'QUESTION-REFERENCE_NOT_FOUND.',
              HttpStatus.NOT_FOUND,
            ),
          );
      }

      const questions = await this.questionsReferenceModel.create(
        createQuestionsReferenceDto,
      );
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: questions,
      });
    } catch (error) {
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

  async findAll(res: Response, skip = 0, limit?: number) {
    try {
      const pipeline = [
        {
          $lookup: {
            from: 'references',
            localField: 'referenceId',
            foreignField: '_id',
            as: 'referencesData',
          },
        },
        {
          $unwind: '$referencesData',
        },
        {
          $project: {
            _id: '$_id',
            referenceId: '$referencesData._id',
            name: '$referencesData.name',
            phoneNumber: '$referencesData.phoneNumber',
            chapterId: '$referencesData.letterSent',
            question1: '$question1',
            question2: '$question2',
            question3: '$question3',
            question4: '$question4',
            question5: '$question5',
            question6: '$question6',
            question7: '$question7',
          },
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $skip: skip > 0 ? (skip - 1) * limit : 0,
              },
              { $limit: limit },
            ],
          },
        },
      ];
      const questions = await this.questionsReferenceModel.aggregate(pipeline);
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: await this.paginateResult.getResult(questions),
        total: await this.paginateResult.getTotalResults(questions),
      });
    } catch (error) {
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

  async findOne(referenceId: string, res: Response) {
    const pipeline = [
      {
        $match: {
          referenceId: ObjectId(referenceId),
        },
      },
      {
        $lookup: {
          from: 'references',
          localField: 'referenceId',
          foreignField: '_id',
          as: 'referencesData',
        },
      },
      {
        $unwind: '$referencesData',
      },
      {
        $project: {
          _id: '$_id',
          referenceId: '$referencesData._id',
          name: '$referencesData.name',
          phoneNumber: '$referencesData.phoneNumber',
          company: '$company',
          relationShip: '$relationShip',
          chapterId: '$referencesData.letterSent',
          question1: '$question1',
          question2: '$question2',
          question3: '$question3',
          question4: '$question4',
          question5: '$question5',
          question6: '$question6',
          question7: '$question7',
          question8: '$question8',
        },
      },
    ];
    const questions = await this.questionsReferenceModel.aggregate(pipeline);

    if (!questions) {
      throw res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new HttpException(
            'QUESTION-REFERENCE_NOT_FOUND.',
            HttpStatus.NOT_FOUND,
          ),
        );
    }
    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: questions[0] != null ? questions[0] : null,
    });
  }

  async update(
    updateQuestionsReferenceDto: UpdateQuestionsReferenceDto,
    res: Response,
  ) {
    try {
      updateQuestionsReferenceDto._id = ObjectId(
        updateQuestionsReferenceDto._id,
      );

      updateQuestionsReferenceDto.interviewId = ObjectId(
        updateQuestionsReferenceDto.interviewId,
      );
      updateQuestionsReferenceDto.userInterviewId = ObjectId(
        updateQuestionsReferenceDto.userInterviewId,
      );

      updateQuestionsReferenceDto.referenceId = ObjectId(
        updateQuestionsReferenceDto.referenceId,
      );

      const qReference = await this.questionsReferenceModel.findOne({
        _id: updateQuestionsReferenceDto._id,
      });

      if (!qReference) {
        throw res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException(
              'QUESTION-REFERENCE_NOT_FOUND.',
              HttpStatus.NOT_FOUND,
            ),
          );
      }
      await this.questionsReferenceModel.updateOne(
        {
          _id: updateQuestionsReferenceDto._id,
        },
        updateQuestionsReferenceDto,
      );
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: updateQuestionsReferenceDto,
      });
    } catch (error) {
      throw res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new HttpException(
            'QUESTION-REFERENCE_NOT_FOUND.',
            HttpStatus.NOT_FOUND,
          ),
        );
    }
  }

  public async createFile(userInterviewId: string): Promise<Buffer> {

    try {
      const pipeline: any = await this.resultQuery(userInterviewId);
      const interview = await this.questionsReferenceModel.aggregate(pipeline);

      const pdfBuffer: Buffer = await new Promise(resolve => {
        const doc = new PDFDocument({
          size: "LETTER",
          bufferPages: true,
          autoFirstPage: false,
        })
        doc.on('pageAdded', () => {

          doc.image(join(process.cwd(), 'src/assets/logo.png'), 20, 15, { width: 67 })
          doc.moveTo(50, 55)

          let bottom = doc.page.margins.bottom;
          doc.page.margins.bottom = 0;
          doc.image(join(process.cwd(), 'src/assets/footer.png'), (doc.page.width - (-165)) * 0.5, doc.page.height - 105, { width: 200 })
          doc.page.margins.bottom = bottom;
        })

        interview.forEach(async (item) => {
          doc.addPage();

          doc.text('', 0, 60);
          doc.font('Helvetica-Bold').fontSize(12);
          doc.text(`Preguntas para Entrevistar a las Referencias de Negocios para una Solicitud de Membresía`, {
            width: doc.page.width,
            align: 'center'
          });

          doc.text('', 0, 90);
          doc.font('Helvetica-Bold').fontSize(9);
          doc.text(`Se recomiendan las siguientes preguntas para las referencias comerciales de las solicitudes de BNI®. `, {
            width: doc.page.width,
            align: 'center'
          });

          doc.text('', 0, 110);
          doc.moveDown();
          doc.text('Información del Solicitante', {
            width: doc.page.width,
            align: 'center'
          });
          doc.text('', 80, 130);
          doc.moveDown();
          doc.text(`NOMBRE: ${item.applicantName}`, {
            width: doc.page.width,
            align: 'left'
          });

          doc.moveDown();
          doc.text(`EMPRESA: ${item.applicantCompany}`, {
            width: doc.page.width,
            align: 'left'
          });

          doc.moveDown();
          doc.text(`TELÉFONO: ${item.applicantPhone}`, {
            width: doc.page.width,
            align: 'left'
          });

          doc.moveTo(60, 197)
            .lineTo(580, 197)
            .stroke();

          doc.text('', 0, 210);
          doc.moveDown();
          doc.text('Información de la Referencia', {
            width: doc.page.width,
            align: 'center'
          });

          doc.text('', 80, 230);
          doc.moveDown();
          doc.text(`NOMBRE:  ${item.referenceName}`, {
            width: doc.page.width,
            align: 'left'
          });

          doc.moveDown();
          doc.text(`EMPRESA: ${item.referenceCompany}`, {
            width: doc.page.width,
            align: 'left'
          });

          doc.moveDown();
          doc.text(`TELÉFONO: ${item.referencePhone}`, {
            width: doc.page.width,
            align: 'left'
          });

          doc.moveDown();
          doc.text(`RELACIÓN: ${item.referenceRelationShip}`, {
            width: doc.page.width,
            align: 'left'
          });

          //PREGUNTA 1 
          doc.moveDown();
          doc.font('Helvetica-Bold').fontSize(9);
          doc.text('1.- ¿Desde cuándo tiene relación con esta persona? ', {
            width: doc.page.width - 115,
            align: 'left'
          });
          doc.moveDown();
          doc.font('Times-Roman').fontSize(9);
          doc.text(`${item.question1}`, {
            width: doc.page.width - 115,
            align: 'left'
          });

          //PREGUNTA 2
          doc.moveDown();
          doc.font('Helvetica-Bold').fontSize(9);
          doc.text('2.- ¿Cuál es la naturaleza de su relación? ', {
            width: doc.page.width - 115,
            align: 'left'
          });
          doc.moveDown();
          doc.font('Times-Roman').fontSize(9);
          doc.text(`${item.question2}`, {
            width: doc.page.width - 115,
            align: 'left'
          });

          //PREGUNTA 3 
          doc.moveDown();
          doc.font('Helvetica-Bold').fontSize(9);
          doc.text('3.- ¿Cómo calificaría la relación de negocios con esta persona o empresa y los servicios que ofrece? ', {
            width: doc.page.width - 115,
            align: 'left'
          });
          doc.moveDown();
          doc.font('Times-Roman').fontSize(9);
          doc.text(`${item.question3}`, {
            width: doc.page.width - 115,
            align: 'left'
          });

          //PREGUNTA 4
          doc.moveDown();
          doc.font('Helvetica-Bold').fontSize(9);
          doc.text('4.- ¿Sabe de alguna queja que alguien haya hecho sobre los productos/servicios que ofrece esta persona/empresa? (En caso de sí, favor de explicar brevemente). ', {
            width: doc.page.width - 115,
            align: 'left'
          });
          doc.moveDown();
          doc.font('Times-Roman').fontSize(9);
          doc.text(`${item.question4}`, {
            width: doc.page.width - 115,
            align: 'left'
          });

          //PREGUNTA 5
          doc.moveDown();
          doc.font('Helvetica-Bold').fontSize(9);
          doc.text('5.- ¿El solicitante cumple y da seguimiento a los compromisos? ', {
            width: doc.page.width - 115,
            align: 'left'
          });
          doc.moveDown();
          doc.font('Times-Roman').fontSize(9);
          doc.text(`${item.question5}`, {
            width: doc.page.width - 115,
            align: 'left'
          });

          //PREGUNTA 6
          doc.moveDown();
          doc.font('Helvetica-Bold').fontSize(9);
          doc.text('6.- ¿Usted contrataría/trabajaría nuevamente con el solicitante? ', {
            width: doc.page.width - 115,
            align: 'left'
          });
          doc.moveDown();
          doc.font('Times-Roman').fontSize(9);
          doc.text(`${item.question6}`, {
            width: doc.page.width - 115,
            align: 'left'
          });

          //PREGUNTA 7
          doc.moveDown();
          doc.font('Helvetica-Bold').fontSize(9);
          doc.text(`7.- ¿Por qué? O ¿Por qué no? `, {
            width: doc.page.width - 115,
            align: 'left'
          });
          doc.moveDown();
          doc.font('Times-Roman').fontSize(9);
          doc.text(`${item.question7}`, {
            width: doc.page.width - 115,
            align: 'left'
          });

          //PREGUNTA 8
          doc.moveDown();
          doc.font('Helvetica-Bold').fontSize(9);
          doc.text(`8.- ¿Alguna otra información que debamos saber acerca de esta persona/empresa para considerarla en su solicitud de membresía?`, {
            width: doc.page.width - 115,
            align: 'left'
          });
          doc.moveDown();
          doc.font('Times-Roman').fontSize(9);
          doc.text(`${item.question8}`, {
            width: doc.page.width - 115,
            align: 'left'
          });
        });
        const buffer = []
        doc.on('data', buffer.push.bind(buffer))
        doc.on('end', () => {
          const data = Buffer.concat(buffer)
          resolve(data)
        })
        doc.end();
      })
      return pdfBuffer;

    } catch (err) {
      console.log('err...', err);
    }
  }

  private async resultQuery(userInterviewId: string) {
    try {
      return [
        {
          $match: { userInterviewId: ObjectId(userInterviewId) }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userInterviewId', //arriba -> questionsreferences
            foreignField: '_id',
            as: 'users',
          }
        },
        {
          $unwind: '$users'
        },
        {
          $lookup: {
            from: 'references',
            localField: 'referenceId',
            foreignField: '_id',
            as: 'references',
          }
        },
        {
          $unwind: '$references'
        },
        {
          $project: {
            applicantName: { $toUpper: { $concat: ['$users.name', ' ', '$users.lastName'] } },
            applicantCompany: { $toUpper: '$users.companyName' },
            applicantPhone: '$users.phoneNumber',
            referenceName: { $toUpper: '$references.name' },
            referenceCompany: { $toUpper: '$company' },
            referencePhone: '$references.phoneNumber',
            referenceRelationShip: { $toUpper: '$relationShip' },
            question1: '$question1',
            question2: '$question2',
            question3: '$question3',
            question4: '$question4',
            question5: '$question5',
            question6: '$question6',
            question7: '$question7',
            question8: '$question8',
          }
        }
      ];
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }
}
