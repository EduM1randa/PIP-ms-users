import { Controller } from "@nestjs/common";
import { ParentService } from "./parent.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateParentDto } from "../dto/create-parent.dto";

@Controller("parent")
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  //    SOLICITUDES CREATE
  @MessagePattern({ cmd: "create-parent" })
  createParent(@Payload() createParentDto: CreateParentDto) {
    return this.parentService.create(createParentDto);
  }

  //    SOLICITUDES GET
  @MessagePattern({ cmd: "find-all-parents" })
  obtainAllParents() {
    return this.parentService.findAll();
  }

  @MessagePattern({ cmd: "obtain-parents-minimun-info" })
  parentMinInfo() {
    return this.parentService.parentsInfo();
  }

  @MessagePattern({ cmd: "obtain-parent-childrens" })
  obtainParentChildrens(@Payload() parentID: string) {
    return this.parentService.obtainChildrens(parentID);
  }

  @MessagePattern({ cmd: "get-parent-by-email" })
  getOneByEmail(@Payload() email: string) {
    return this.parentService.obtainByEmail(email);
  }

  @MessagePattern({ cmd: "get-parent-by-id" })
  getProfile(@Payload() id: string) {
    return this.parentService.obtainById(id);
  }

  @MessagePattern({ cmd: "get-parents-email" })
  getParentsEmail(@Payload() id: string) {
    return this.parentService.obtainParentsEmail(id);
  }

  //    SOLICITUDES DELETE
  @MessagePattern({ cmd: "delete-parent-by-email" })
  removeOne(@Payload() email: string) {
    return this.parentService.removeParent(email);
  }

  //    SOLICITUDES UPDATE
  /*
    🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
    🌑🌑🌑🌔🌕🌕🌕🌘🌑🌑🌑
    🌑🌑🌓🌕🌕🌕🌕🌕🌗🌑🌑
    🌑🌑🌔🌕🌘🌑🌒🌕🌗🌑🌑
    🌑🌑🌕🌘🌑🌑🌑🌒🌖🌑🌑
    🌑🌒🌕🌕🌘🌑🌒🌕🌕🌑🌑
    🌑🌒🌕🌕🌕🌕🌕🌕🌕🌑🌑
    🌑🌒🌕🌕🌕🌕🌕🌕🌕🌑🌑
    🌑🌒🌕🌕🌕🌖🌕🌕🌕🌑🌑
    🌑🌒🌕🌕🌗🌑🌓🌕🌕🌑🌑
    🌒🌕🌕🌕🌗🌔🌕🌕🌕🌑🌑
    🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
 */
}
