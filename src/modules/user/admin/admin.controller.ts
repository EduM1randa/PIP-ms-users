import {
  Controller,
  HttpException,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { CreateadminDto } from "../dto/create-admin.dto";
import { AdminService } from "./admin.service";
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from "@nestjs/microservices";
import { Admin } from "../schemas/admin.schema";
import { RelateParentStudentDto } from "../dto/relate-parent-student.dto";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @MessagePattern({ cmd: "relate-parent-student" })
  relateFatherStudent(@Payload() familyId: RelateParentStudentDto) {
    return this.adminService.relateParentStudent(familyId);
  }

  @MessagePattern({ cmd: "create-admin" })
  createParent(@Payload() createadminDto: CreateadminDto) {
    return this.adminService.createAdmin(createadminDto);
  }

  @MessagePattern({ cmd: "get-all-admins" })
  getAllAdmins() {
    return this.adminService.findAllAdmins();
  }

  @MessagePattern({ cmd: "obtain-admins-minimun-info" })
  obtainMinimunInfo() {
    return this.adminService.adminsInfo();
  }

  @MessagePattern({ cmd: "get-by-email" })
  getOneByEmail(@Payload() email: string): Promise<Admin | null> {
    return this.adminService.getAdmin(email);
  }

  @MessagePattern({ cmd: "get-by-id" })
  getProfile(@Payload() id: string): Promise<Admin | null> {
    return this.adminService.getAdminById(id);
  }

  @MessagePattern({ cmd: "delete-admin-by-email" })
  removeOne(@Payload() email: string) {
    return this.adminService.removeAdmin(email);
  }

  @MessagePattern({ cmd: "get-error" })
  async geterror() {
    throw new HttpException("Prueba de conflicto", HttpStatus.CONFLICT);
  }

  @MessagePattern("notifications")
  getNotifications(@Payload() data: number[], @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);
  }
}
