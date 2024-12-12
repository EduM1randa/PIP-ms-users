import { Module } from "@nestjs/common";
import { AdminController } from "./admin/admin.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { AdminSchema, Admin } from "./schemas/admin.schema";
import { AuthService } from "../auth/auth.service";
import { ParentController } from "./parent/parent.controller";
import { ParentService } from "./parent/parent.service";
import { TeacherController } from "./teacher/teacher.controller";
import { TeacherService } from "./teacher/teacher.service";
import { Parent, ParentSchema } from "./schemas/parent.schema";
import { Teacher, TeacherSchema } from "./schemas/teacher.schema";
import { AdminService } from "./admin/admin.service";
import { Student, StudentSchema } from "../students/schemas/student.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Parent.name, schema: ParentSchema },
      { name: Teacher.name, schema: TeacherSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [AdminController, ParentController, TeacherController],
  providers: [
    AdminController,
    AuthService,
    ParentService,
    TeacherService,
    AdminService,
  ],
  exports: [AdminController, ParentService, TeacherService, AdminService],
})
export class UserModule {}
