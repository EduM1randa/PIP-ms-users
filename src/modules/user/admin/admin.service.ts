import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateadminDto } from "../dto/create-admin.dto";
import { Admin } from "../schemas/admin.schema";
import mongoose, { Model, Types } from "mongoose";
import { hash } from "bcrypt";
import { RelateParentStudentDto } from "../dto/relate-parent-student.dto";
import { Student } from "src/modules/students/schemas/student.schema";
import { Parent } from "../schemas/parent.schema";

const saltRounds = 10;

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private AdminModel: Model<Admin>,
    @InjectModel(Student.name) private StudenModel: Model<Student>,
    @InjectModel(Parent.name) private ParentModel: Model<Parent>,
  ) {}

  async createAdmin(createAdminDto: CreateadminDto): Promise<Admin> {
    try {
      const newAdmin = new this.AdminModel(createAdminDto);
      newAdmin.password = await hash(createAdminDto.password, saltRounds);
      return await newAdmin.save();
    } catch (error) {
      if ((error as any).code === 11000) {
        throw new ConflictException("El correo ya está en uso");
      }
      throw error;
    }
  }

  async relateParentStudent(
    familyId: RelateParentStudentDto,
  ): Promise<boolean> {
    console.log("Asignando relación Apoderado-Estudiante");

    // Buscar al padre por ID
    const parent = await this.ParentModel.findById(familyId.parentId);
    if (!parent) {
      throw new NotFoundException(
        `Padre con id ${familyId.parentId} no fue encontrado`,
      );
    }

    console.log("Apoderado: ", parent.firstName);
    console.log("Hijos del apoderado: ", parent.childrens);

    // Buscar al estudiante por ID
    const student = await this.StudenModel.findById(familyId.childId);
    if (!student) {
      throw new NotFoundException(
        `Estudiante con id ${familyId.childId} no fue encontrado`,
      );
    }

    console.log("Estudiante: ", student.names);
    console.log("Padres del estudiante: ", student.parents);

    // Verificar si existe alguna de las relaciones :3
    if (!parent.childrens.includes(familyId.childId)) {
      console.log("Padre no tiene al hijo en array");
      parent.childrens.push(familyId.childId);
      console.log("Hijo incluido");
    }

    if (!student.parents) {
      // Si parents es undefined, inicialízalo como un array vacío
      student.parents = [];
    }

    if (!student.parents.includes(new Types.ObjectId(familyId.parentId))) {
      console.log("Hijo no tiene al padre en array");
      student.parents.push(new Types.ObjectId(familyId.parentId));
      console.log("Padre incluido");
    }

    // Guardar los cambios en ambos documentos
    await parent.save();
    await student.save();

    console.log("Relación asignada correctamente");
    return true;
  }

  async getAdmin(email: string): Promise<Admin | null> {
    const admin = await this.AdminModel.findOne({ email: email }).exec();
    console.log(email);
    console.log(admin);
    return admin;
  }

  async adminsInfo(): Promise<Admin[]> {
    return await this.AdminModel.find()
      .select("firstName lastname  email role")
      .exec();
  }

  async findAllAdmins(): Promise<Admin[]> {
    return await this.AdminModel.find().exec();
  }

  async removeAdmin(email: string) {
    this.AdminModel.deleteOne({ email: email })
      .then(() => console.log("admin deleted"))
      .catch((err) => console.log(err));
  }

  async getAdminByResetToken(token: string): Promise<Admin | null> {
    return await this.AdminModel.findOne({ resetPasswordToken: token }).exec();
  }

  async getAdminById(id: string): Promise<Admin | null> {
    return await this.AdminModel.findById(id)
      .select("firstName lastname age email phone birthday address role")
      .exec();
  }
}
