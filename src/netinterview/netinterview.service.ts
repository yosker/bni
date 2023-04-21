import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { NetinterviewDTO } from './dto/netinterview.dto';
import { Netinterview } from './interfaces/neinterview.interface';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { EstatusRegister } from 'src/shared/enums/register.enum';
import { join } from 'path';

const ObjectId = require('mongodb').ObjectId;
const PDFDocument = require('pdfkit-table');
@Injectable()
export class NetinterviewService {
  constructor(
    @InjectModel('Netinterview')
    private readonly netinterviewModel: Model<Netinterview>,
    private servicesResponse: ServicesResponse,
  ) { }

  //ENDPOINT PARA LA GUARDAR ENTREVISTAS DE 7 Y 1O MESES
  async createInterview(
    netinterviewDTO: NetinterviewDTO,
    JWTPayload: any,
    res: Response,
  ): Promise<Response> {
    const { result } = this.servicesResponse;
    try {
      netinterviewDTO = {
        ...netinterviewDTO,
        chapterId: ObjectId(JWTPayload.chapterId),
        userId: ObjectId(netinterviewDTO.userId),
        createdBy: JWTPayload.name,
      };

      await this.netinterviewModel.create(netinterviewDTO);

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: result,
      });
    } catch (err) {
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

  //ENDPOINT QUE REGRESA UNA LISTA DE TODAS LAS ENTREVISTAS
  async findAll(userId: string, res: Response): Promise<Response> {
    try {
      const interview = await this.netinterviewModel
        .find({ userId: ObjectId(userId), status: EstatusRegister.Active })
        .sort({ createdAt: -1 });

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: interview,
      });
    } catch (err) {
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

  //ENDPOINT QUE REGRESA LA INFORMACIÓN DE UNA ENTREVISTA EN PARTICULAR
  async findOne(interviewId: string, res: Response): Promise<Response> {
    try {
      const interview = await this.netinterviewModel.findById({
        _id: ObjectId(interviewId),
      });

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: interview,
      });
    } catch (err) {
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

  //ENDPOINT PARA ACTUALIZAR LA INFORMACIÓN DE LA ENTREVISTA
  async update(
    netinterviewDTO: NetinterviewDTO,
    interviewId: string,
    JWTPayload: any,
    res: Response,
  ): Promise<Response> {
    const { result } = this.servicesResponse;

    try {
      netinterviewDTO = {
        ...netinterviewDTO,
        userId: ObjectId(netinterviewDTO.userId),
        createdBy: JWTPayload.name,
      };
      await this.netinterviewModel.findByIdAndUpdate(
        ObjectId(interviewId),
        netinterviewDTO,
      );

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: result,
      });
    } catch (error) {
      throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
    }
  }

  async createFile(interviewId: string): Promise<Buffer> {

    try {

      const pipeline: any = await this.resultQueryInterview(interviewId);
      const interview = await this.netinterviewModel.aggregate(pipeline);

      const pdfBuffer: Buffer = await new Promise(resolve => {
        const doc = new PDFDocument({
          size: "LETTER",
          bufferPages: true,
          autoFirstPage: false,
        })

        let pageNumber = 0;
        doc.on('pageAdded', () => {
          pageNumber++;

          doc.image(join(process.cwd(), 'src/assets/logo.png'), 20, 15, { width: 67 })
          doc.moveTo(50, 55)

          let bottom = doc.page.margins.bottom;
          doc.page.margins.bottom = 0;
          doc.image(join(process.cwd(), 'src/assets/footer.png'), (doc.page.width - (-165)) * 0.5, doc.page.height - 105, { width: 200 })
          doc.page.margins.bottom = bottom;
        })

        doc.addPage();
        doc.text('', 0, 50);
        doc.font('Helvetica-Bold').fontSize(11);
        doc.text(`Formato de revisión de los ${interview[0].interviewType}`, {
          width: doc.page.width,
          align: 'center'
        });

        doc.text('', 80, 80);
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text(`Nombre del networker: ${interview[0].name}`, {
          width: doc.page.width,
          align: 'left'
        });
        doc.moveDown();
        doc.text('Documentos requeridos:', {
          width: doc.page.width,
          align: 'left'
        });
        doc.moveDown();
        doc.text('* Semáforo para Miembros / Poder de uno          * Registros de Capacitación de Miembro', {
          width: doc.page.width,
          align: 'left'
        });

        doc.moveDown();
        doc.text('Comentarios por el Comité de Membresías', {
          width: doc.page.width,
          align: 'left'
        });
        const createdDate = interview[0].createdAt.toLocaleDateString();
        const table = {
          headers: ['Fuerzas:', 'Desarrollo Potencial:'],
          rows: [
            [`${interview[0].strength1}`, `${interview[0].growth1}`],
            [`${interview[0].strength2}`, `${interview[0].growth2}`],
            [`Revisó: ${interview[0].createdBy}`, `Fecha de revisión: ${createdDate}`]],
          options: {
            divider: {
              header: { disabled: false, width: 0.5, opacity: 0.5 },
              vertical: { disabled: false, width: 1, opacity: 0.5 },
            },
          }
        }
        doc.moveDown();
        doc.table(table, { columnSize: [150, 300] });

        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text('Preguntas durante la revisión:', {
          width: doc.page.width,
          align: 'left'
        });

        //PREGUNTA 1 
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text('1.- ¿Cómo te sientes en el capítulo?', {
          width: doc.page.width - 100,
          align: 'left'
        });

        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`${interview[0].question1}`, {
          width: doc.page.width - 110,
          align: 'left'
        });

        //PREGUNTA 2
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text('2.- ¿Cómo evaluaría sus beneficios de su membresía de BNI?', {
          width: doc.page.width - 110,
          align: 'left'
        });

        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`${interview[0].question2}`, {
          width: doc.page.width - 110,
          align: 'left'
        });

        //PREGUNTA 3 
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text('3.- ¿Hasta qué punto han alcanzado sus metas en cuanto a DAR y RECIBIR en los últimos 6 meses?', {
          width: doc.page.width - 110,
          align: 'left'
        });

        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`${interview[0].question3}`, {
          width: doc.page.width - 110,
          align: 'left'
        });

        //PREGUNTA 4
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text('4.- ¡Discusión de los comentarios del Comité de Membresía (véase más arriba)!', {
          width: doc.page.width - 110,
          align: 'left'
        });

        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`${interview[0].question7}`, {
          width: doc.page.width - 110,
          align: 'left'
        });


        //PREGUNTA 5
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text('5.- ¿Qué sugerencias tienes?', {
          width: doc.page.width - 110,
          align: 'left'
        });

        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`${interview[0].question4}`, {
          width: doc.page.width - 110,
          align: 'left'
        });

        //PREGUNTA 6
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text('6.- ¿Qué otros temas te gustarían discutir?', {
          width: doc.page.width - 110,
          align: 'left'
        });

        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`${interview[0].question5}`, {
          width: doc.page.width - 110,
          align: 'left'
        });

        //PREGUNTA 6
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text(`Pregunta final: Si tuviera que decidir hoy si solicitará la renovación de su membresía, ¿cuál es la probabilidad (en%) de que renueve?`
          , {
            width: doc.page.width - 110,
            align: 'left'
          });

        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`${interview[0].question6}`, {
          width: doc.page.width - 110,
          align: 'left'
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

  private async resultQueryInterview(interviewId: string) {
    try {
      return [
        {
          $match: { _id: ObjectId(interviewId) }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'users',
          }
        },
        {
          $unwind: '$users'
        },
        {
          $project: {
            createdBy: '$createdBy',
            strength1: '$strength1',
            strength2: '$strength2',
            growth1: '$growth1',
            growth2: '$growth2',
            interviewType: '$interviewType',
            question1: '$question1',
            question2: '$question2',
            question3: '$question3',
            question4: '$question4',
            question5: '$question5',
            question6: '$question6',
            question7: '$question7',
            createdAt: '$createdAt',
            name: { $toUpper: { $concat: ['$users.name', ' ', '$users.lastName'] } }
          }
        }
      ];
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }
  //https://www.youtube.com/watch?v=39OOfeUteGs
}
