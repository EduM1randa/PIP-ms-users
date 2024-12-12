// teacher.service.ts
import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Teacher } from "../schemas/teacher.schema";
import { isValidObjectId, Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CreateTeacherDto } from "../dto/create-teacher.dto";
import { hash } from "bcrypt";
import { BADRESP } from "dns";

const saltRounds = 10;

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    try {
      const newTeacher = new this.teacherModel(createTeacherDto);
      newTeacher.password = await hash(createTeacherDto.password, saltRounds);
      return await newTeacher.save();
    } catch (error) {
      if ((error as any).code === 11000) {
        throw new ConflictException("El correo ya está en uso");
      }
      throw error;
    }
  }

  async findAll(): Promise<Teacher[]> {
    return await this.teacherModel.find().exec();
  }

  async obtainByEmail(email: string): Promise<Teacher | null> {
    return await this.teacherModel.findOne({ email: email }).exec();
  }

  async obtainById(id: string): Promise<Teacher | null> {
    console.log(await this.teacherModel.findById(id));
    return await this.teacherModel.findOne({ _id: id });
  }

  async teachersInfo(): Promise<Teacher[]> {
    return await this.teacherModel
      .find()
      .select("firstName lastname email")
      .exec();
  }

  async obtainSubjects(teacherID: string): Promise<string[] | null> {
    const teacher = await this.teacherModel
      .findById(teacherID, "subjects")
      .exec();
    if (!teacher) {
      return null;
    }

    return teacher.subjects;
  }

  async removeTeacher(email: string) {
    const result = await this.teacherModel.deleteOne({ email: email });

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `Teacher with email \"${email}" was not found`,
      );
    }

    return { message: `Teacher with email ${email} was deleted` };
  }

  async assignSubjectToTeacher(teacherID: string, subjectID: string) {
    const teacher = await this.teacherModel.findById(teacherID).exec();
    if (!teacher) {
      throw new NotFoundException("Teacher not found");
    }

    if (teacher.subjects.includes(subjectID)) {
      throw new ConflictException("Teacher already has that subject");
    }

    teacher.subjects.push(subjectID);
    await teacher.save();

    return teacher;
  }
}
