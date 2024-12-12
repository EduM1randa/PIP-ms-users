import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { Model, Types } from "mongoose";
import { Student } from "./schemas/student.schema";
import { InjectModel } from "@nestjs/mongoose";
import { ClientProxy } from "@nestjs/microservices";
import { ParentService } from "../user/parent/parent.service";
import { lastValueFrom } from "rxjs";
import moment from "moment";

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @Inject(forwardRef(() => ParentService))
    private readonly parentService: ParentService,
    @Inject("SUBJECTS_SERVICE") private subjectsClient: ClientProxy,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const {
      names,
      lastNames,
      rut,
      birthday,
      address,
      phone,
      // parents,
      courseId,
      medicalObservations,
    } = createStudentDto;

    if (
      !names ||
      !lastNames ||
      !rut ||
      !birthday ||
      !phone ||
      !address ||
      !courseId
    ) {
      throw new BadRequestException("Faltan datos obligatorios.");
    }

    const existCourse = await lastValueFrom(
      this.subjectsClient.send(
        { cmd: "get-course-by-id" },
        courseId.toString(),
      ),
    );
    if (!existCourse) throw new NotFoundException("El curso no existe.");

    // if(parents){
    //   for (const parent of parents) {
    //     const paretnsExist = await this.parentService
    //     .obtainById(parent.toString());
    //     if(!paretnsExist)
    //       throw new Error('No se encontró un padre con el id: ' + parent);
    //   }
    // }

    const studentExist = await this.studentModel.findOne({ rut });
    if (studentExist)
      throw new BadRequestException("Ya existe este estudiante.");

    const birthdayDate = moment(birthday, "DD-MM-YYYY").toDate();
    const courseID = new Types.ObjectId(courseId);

    const studentCreate: Student = {
      names,
      lastNames,
      rut,
      birthday: birthdayDate,
      address,
      phone,
      courseId: courseID,
      medicalObservations,
    };
    try {
      const newStudent = new this.studentModel(studentCreate);
      return await newStudent.save();
    } catch (error) {
      throw new InternalServerErrorException("Error al crear el estudiante.");
    }
  }

  async findOne(id: string): Promise<Student> {
    try {
      const student = await this.studentModel
        .findById(id)
        .select("_id names lastNames rut birthday courseId");
      if (!student)
        throw new NotFoundException("No se encontró el estudiante.");
      return student;
    } catch (error) {
      throw new InternalServerErrorException("Error al obtener el estudiante.");
    }
  }

  async findAll(): Promise<Student[]> {
    try {
      return await this.studentModel.find();
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al obtener los estudiantes.",
      );
    }
  }

  async getMedicalObservations(studentId: string): Promise<string[]> {
    const student = await this.studentModel.findById(studentId);
    if (!student) throw new NotFoundException("No se encontró el estudiante.");
    if (!student.medicalObservations) {
      throw new BadRequestException(
        "Error al obtener las observaciones medicas.",
      );
    }
    return student.medicalObservations;
  }
}
