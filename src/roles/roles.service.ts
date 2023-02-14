import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './interfaces/roles.interface';
import { Roles } from './schemas/roles.schema';
import { Response } from 'express';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Roles.name) private readonly rolesModel: Model<Role>,
    private servicesResponse: ServicesResponse,
  ) {}

  async create(
    _createRoleDto: CreateRoleDto,
    res: Response,
  ): Promise<Response> {
    try {
      const role = await this.rolesModel.create(_createRoleDto);
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: role,
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

  async findAll(res: Response): Promise<Response> {
    try {
      const roles = await this.rolesModel.find({});
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: roles,
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

  async findOne(id: number, res: Response): Promise<Response> {
    try {
      const role = await this.rolesModel.findOne({
        _id: id,
      });
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: role,
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

  async update(
    id: number,
    _updateRoleDto: UpdateRoleDto,
    res: Response,
  ): Promise<Response> {
    this.rolesModel.findByIdAndUpdate(id, _updateRoleDto, { new: true });
    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: _updateRoleDto,
    });
  }
}
