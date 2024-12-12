import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Parent } from "../schemas/parent.schema";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CreateParentDto } from "../dto/create-parent.dto";
import { hash } from "bcrypt";
import { Student } from "src/modules/students/schemas/student.schema";

const saltRounds = 10;

@Injectable()
export class ParentService {
  constructor(
    @InjectModel(Parent.name) private parentModel: Model<Parent>,
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
  ) {}

  async create(createParentDto: CreateParentDto): Promise<Parent> {
    try {
      const newParent = new this.parentModel(createParentDto);
      newParent.password = await hash(createParentDto.password, saltRounds);
      return await newParent.save();
    } catch (error) {
      if ((error as any).code === 11000) {
        throw new ConflictException("El correo ya está en uso");
      }
      throw error;
    }
  }

  async findAll(): Promise<Parent[]> {
    return await this.parentModel.find().exec();
  }

  async obtainByEmail(email: string): Promise<Parent | null> {
    return await this.parentModel.findOne({ email: email }).exec();
  }

  async obtainById(id: string): Promise<Parent | null> {
    return await this.parentModel.findById(id).exec();
  }

  async parentsInfo(): Promise<Parent[]> {
    return await this.parentModel
      .find()
      .select("firstName lastname email phone")
      .exec();
  }

  async obtainChildrens(parentID: string): Promise<string[] | null> {
    const parent = await this.parentModel
      .findById(parentID, "childrens")
      .exec();
    if (!parent) {
      return null;
    }

    return parent.childrens;
  }

  async obtainParentsEmail(studentId: string): Promise<string[]> {
    console.log("Obteniendo correos de padres");
    if (!Types.ObjectId.isValid(studentId))
      throw new NotFoundException("Id de estudiante inválida");

    const student = await this.studentModel.findById(studentId);

    if (!student)
      throw new NotFoundException(
        "No se encontró estudiante con id",
        studentId,
      );

    const parents = await this.parentModel
      .find({ _id: { $in: student.parents } })
      .select("email")
      .exec();

    console.log("Parents: ", parents);

    for (const parent of parents) {
      console.log("Correo padres: ", parent.email);
    }
    return parents.map((parents) => parents.email);
  }

  async removeParent(email: string) {
    const result = await this.parentModel.deleteOne({ email: email });

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `Parent with email \"${email}" was not found`,
      );
    }

    return { message: `Parent with email ${email} was deleted` };
  }
}
