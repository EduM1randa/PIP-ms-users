import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in.dto";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PasswordResetTokenDto } from "./dto/request-reset-token.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern({ cmd: "parent-login" })
  async parentSignIn(@Payload() signInDto: SignInDto) {
    const token = await this.authService.parentSignIn(
      signInDto.email,
      signInDto.password,
    );
    return token;
  }

  @MessagePattern({ cmd: "teacher-login" })
  async teacherSignIn(@Payload() signInDto: SignInDto) {
    const token = await this.authService.teacherSignIn(
      signInDto.email,
      signInDto.password,
    );
    return token;
  }

  @MessagePattern({ cmd: "admin-login" })
  async adminSignIn(@Payload() signInDto: SignInDto) {
    const token = await this.authService.adminSignIn(
      signInDto.email,
      signInDto.password,
    );
    return token;
  }

  /*
  @MessagePattern({ cmd: "request-reset-token" })
  async createPasswordResetToken(
    @Payload() passwordResetToken: PasswordResetTokenDto,
  ) {
    return await this.authService.createPasswordResetToken(
      passwordResetToken,
    );
  }

  @MessagePattern({ cmd: "password-reset" })
  async resetPassword(@Payload() resetPassword: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPassword);
  }
    */
}
