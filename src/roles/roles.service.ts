import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './interfaces/roles.interface';
import { Roles } from './schemas/roles.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Roles.name) private readonly rolesModel: Model<Role>,
    private servicesResponse: ServicesResponse,
  ) {}

  async create(_createRoleDto: CreateRoleDto) {
    return await this.rolesModel.create(_createRoleDto);
  }

  async findAll() {
    return await this.rolesModel.find();
  }

  async findOne(id: number) {
    return await this.rolesModel.findOne({
      _id: id,
    });
  }

  async update(id: number, _updateRoleDto: UpdateRoleDto) {
    return this.rolesModel.findByIdAndUpdate(id, _updateRoleDto, { new: true });
  }
}
