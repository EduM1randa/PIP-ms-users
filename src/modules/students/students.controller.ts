import { Controller } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Student } from './schemas/student.schema';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @MessagePattern({ cmd: "create-student" })
  async create(
    @Payload() createStudentDto: CreateStudentDto
  ): Promise<Student> {
    console.log('createStudentDto', createStudentDto);
    return await this.studentsService.create(createStudentDto);
  }

  @MessagePattern({ cmd: 'get-student' })
  async findOne(@Payload() id: string): Promise<Student> {
    return await this.studentsService.findOne(id);
  }

  @MessagePattern({ cmd: 'get-students' })
  async findAll(): Promise<Student[]> {
    return await this.studentsService.findAll();
  }

  @MessagePattern({ cmd: 'get-medical-observations' })
  async getMedicalObservations(@Payload() id:string): Promise<string[]> {
    return await this.studentsService.getMedicalObservations(id);
  }
}
