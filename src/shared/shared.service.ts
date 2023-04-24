import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ServicesResponse } from 'src/responses/response';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { S3 } from 'aws-sdk';

const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');
const generateSafeId = require('generate-safe-id');
import { join } from 'path';
import { bool } from 'aws-sdk/clients/redshiftdata';

@Injectable()
export class SharedService {
  private region = process.env.AWS_REGION;
  private accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  private secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  private s3 = new S3({
    region: this.region,
    accessKeyId: this.accessKeyId,
    secretAccessKey: this.secretAccessKey,
  });

  constructor(
    private servicesResponse: ServicesResponse,
    private mailerService: MailerService,
  ) { }

  /**
   * @description Genera un password aleatorio
   * @param longitude tamaño de password
   * @returns password generado
   */
  async passwordGenerator(longitude: number) {
    let result = '';
    const abc = 'a b c d e f g h i j k l m n o p q r s t u v w x y z'.split(
      ' ',
    ); // Espacios para convertir cara letra a un elemento de un array

    for (let i = 0; i < longitude; i++) {
      if (abc[i]) {
        // Condicional para prevenir errores en caso de que longitud sea mayor a 26
        const random = Math.floor(Math.random() * 4); // Generaremos el número
        const random2 = Math.floor(Math.random() * abc.length); // Generaremos el número
        const random3 = Math.floor(Math.random() * abc.length + 3); // Generaremos el número
        if (random == 1) {
          result += abc[random2];
        } else if (random == 2) {
          result += random3 + abc[random2];
        } else {
          result += abc[random2].toUpperCase();
        }
      }
    }
    return result;
  }

  async sendEmail(emailProperties: any): Promise<ServicesResponse> {
    const { statusCode, message, result } = this.servicesResponse;
    try {
      emailProperties = {
        ...emailProperties,
        urlPlatform: process.env.URL_PLATFORM,
      };

      await this.mailerService.sendMail({
        to: emailProperties.email,
        from: emailProperties.from,
        subject: emailProperties.subject,
        template: emailProperties.template,
        context: {
          objMail: emailProperties,
        },
      });
    } catch (err) {
      throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
    }
    return { statusCode, message, result };
  }

  //FUNCIÓN PARA CARGAR IMAGENES Y ARCHIVOS AL S3 DE AWS
  async uploadFile(
    dataBuffer: Buffer,
    file: string,
    ext: string,
    bucketName: string,
  ): Promise<ServicesResponse> {
    try {
      const { statusCode, message } = this.servicesResponse;

      const newId = generateSafeId();
      const fileName = ext != '' ? newId + ext : file;
      const uploadResult = await this.s3
        .upload({
          Bucket: bucketName,
          Body: dataBuffer,
          Key: fileName,
        })
        .promise();

      return { statusCode, message, result: uploadResult.Location };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteObjectFromS3(
    bucketName: string,
    objectName: string,
  ): Promise<ServicesResponse> {
    const { statusCode, message, result } = this.servicesResponse;
    const params = { Bucket: bucketName, Key: objectName.split('/')[3] };

    if (objectName != '') {
      this.s3.deleteObject(params, function (err, data) {
        if (err) console.log(err);
        return data;
      });
    }
    return { statusCode, message, result };
  }

  async validatePermissions(page: string, role: string) {
    let response = false;
    try {
      const arrPresident = [
        'usersform',
        'userslist',
        'visitorslist',
        'emailaccounts',
        'evaluationperiod',
        'activities',
        'interviewslist',
        'absencesform',
      ];

      if (role == 'Presidente') {
        const includePage = arrPresident.includes(page);
        response = includePage ? true : false;
      }
    } catch (err) { }
    return response;
  }

  async sendMailer(emailProperties: any, attachment: bool) {
    try {
      const transport: any = {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        service: 'Outlook365',
        auth: {
          user: emailProperties.emailConfigAut,
          pass: emailProperties.passwordAut,
        },
      };

      const mailTransport = nodemailer.createTransport(transport);

      // point to the template folder
      const handlebarOptions = {
        viewEngine: {
          partialsDir: join(__dirname, 'mails'),
          defaultLayout: false,
        },
        viewPath: join(__dirname, 'mails'),
      };

      // use a template file with nodemailer
      mailTransport.use('compile', hbs(handlebarOptions));

      const attachmentProperties = [];
      if (attachment) {
         const obj = {
          filename: 'carta.pdf',
          contentDisposition: "attachment",
          content: (Buffer.from(emailProperties.file)),
        }
        attachmentProperties.push(obj);
      }

      let emailOptions = {
        from: emailProperties.emailConfigAut,
        to: emailProperties.to,
        replyTo: emailProperties.emailConfigAut,
        subject: emailProperties.subject,
        text: emailProperties.template,
        template: emailProperties.template,
        user: emailProperties.user,
        pass: emailProperties.pass,
        attachments: attachmentProperties,
        context: {
          objMail: emailProperties,
        },
      }

      mailTransport.sendMail(emailOptions,
        function (error: any) {
          if (error) {
            console.log(error);
            return;
          }
          console.log('Message sent');
          mailTransport.close();
        },
      );
    } catch (error) {
      console.log('Error getConfigEmail: ', error);
      throw error;
    }
  }
}
