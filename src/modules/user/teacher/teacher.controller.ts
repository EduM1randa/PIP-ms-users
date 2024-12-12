// teacher.controller.ts
import { Controller } from "@nestjs/common";
import { TeacherService } from "./teacher.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateTeacherDto } from "../dto/create-teacher.dto";

@Controller("teacher")
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  //    SOLICITUDES CREATE
  @MessagePattern({ cmd: "create-teacher" })
  createTeacher(@Payload() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto);
  }

  //    SOLICITUDES GET
  @MessagePattern({ cmd: "find-all-teachers" })
  obtainAllTeachers() {
    return this.teacherService.findAll();
  }

  @MessagePattern({ cmd: "obtain-teachers-minimun-info" })
  teacherMinInfo() {
    return this.teacherService.teachersInfo();
  }

  @MessagePattern({ cmd: "obtain-teacher-subjects" })
  obtainTeacherSubjects(@Payload() teacherID: string) {
    return this.teacherService.obtainSubjects(teacherID);
  }

  @MessagePattern({ cmd: "get-teacher-by-email" })
  getOneByEmail(@Payload() email: string) {
    return this.teacherService.obtainByEmail(email);
  }

  @MessagePattern({ cmd: "get-teacher-by-id" })
  async getProfile(@Payload() id: string) {
    return await this.teacherService.obtainById(id);
  }

  @MessagePattern({ cmd:"assign-subject-to-teacher"})
  async assignSubjectToTeacher(@Payload() data: {
    teacherID: string, 
    subjectID: string
  }){
    return this.teacherService.assignSubjectToTeacher(
      data.teacherID, data.subjectID);
  }

  //    SOLICITUDES DELETE
  @MessagePattern({ cmd: "delete-teacher-by-email" })
  removeOne(@Payload() email: string) {
    return this.teacherService.removeTeacher(email);
  }

  //    SOLICITUDES UPDATE
  //    ¿PROXIMAMENTE?
}
