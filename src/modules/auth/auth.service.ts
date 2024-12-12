import { HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { AdminService } from "../user/admin/admin.service";
import { JwtService } from "@nestjs/jwt";
import { compare, genSalt, hash } from "bcrypt";
import { PasswordResetTokenDto } from "./dto/request-reset-token.dto";
import { randomBytes } from "crypto";
import { EmailService } from "../email/email.service";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { differenceInMinutes } from "date-fns";
import { ResponseMessage } from "../shared/response.interface";
import { ParentService } from "../user/parent/parent.service";
import { TeacherService } from "../user/teacher/teacher.service";
import { UserRole } from "src/common/enums/roles.enum";

@Injectable()
export class AuthService {
  constructor(
    private parentService: ParentService,
    private teacherService: TeacherService,
    private adminService: AdminService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async parentSignIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string } | null> {
    const parent = await this.parentService.obtainByEmail(email);
    if (!parent) {
      return null;
    }

    const isPasswordValid = await this.comparePasswords(
      password,
      parent.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: parent._id.toString(), // ID del usuario
      firstName: parent.firstName, // Nombre
      lastName: parent.lastName, // Apellido
      email: parent.email, // Correo electrónico
      phone: parent.phone,
      childrens: parent.childrens,
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async teacherSignIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string } | null> {
    const teacher = await this.teacherService.obtainByEmail(email);
    if (!teacher) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await this.comparePasswords(
      password,
      teacher.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: teacher._id.toString(), // ID del usuario
      firstName: teacher.firstName, // Nombre
      lastName: teacher.lastName, // Apellido
      email: teacher.email, // Correo electrónico
      subjects: teacher.subjects,
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async adminSignIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string } | null> {
    const admin = await this.adminService.getAdmin(email);
    if (!admin) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await this.comparePasswords(
      password,
      admin.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: admin._id.toString(), // ID del usuario
      email: admin.email, // Correo electrónico
      role: UserRole.ADMIN,
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(password, salt);
  }

  // Método para comparar una contraseña con su hash
  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  /*
  async createPasswordResetToken(
    passwordResetToken: PasswordResetTokenDto,
  ): Promise<ResponseMessage> {
    const { email } = passwordResetToken;
    if (!email)
      return {
        status: HttpStatus.BAD_REQUEST,
        success: false,
        message: "Email is required",
      };

    const user = await this.userService.getUser(email);
    if (!user)
      return {
        status: HttpStatus.NOT_FOUND,
        success: false,
        message: "User not found",
      };

    const token = randomBytes(6).toString("hex");
    const userUpdate: User | null = await this.userService.updateById(
      user._id.toString(),
      {
        resetPasswordToken: token,
        resetPasswordExpires: new Date(Date.now() + 600000), // 10 minutos
      },
    );

    if (userUpdate) {
      await this.userService.updateById(userUpdate._id.toString(), userUpdate);

      const sendMail = await this.emailService.sendMailRecovery(
        userUpdate.email,
        userUpdate.resetPasswordToken || "",
      );
      if (!sendMail?.success)
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Error sending email",
        };
      return {
        status: HttpStatus.OK,
        success: true,
        message: "Token sent successfully",
      };
    } else {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Error updating user",
      };
    }
  }

  async resetPassword(
    resetPassword: ResetPasswordDto,
  ): Promise<ResponseMessage> {
    const { newPassword, token } = resetPassword;

    if (!newPassword)
      return {
        status: HttpStatus.BAD_REQUEST,
        success: false,
        message: "New password is required",
      };
    if ((newPassword ?? "").length < 8)
      return {
        status: HttpStatus.BAD_REQUEST,
        success: false,
        message: "Password must be at least 8 characters",
      };
    if (!token)
      return {
        status: HttpStatus.BAD_REQUEST,
        success: false,
        message: "Token is required",
      };

    const user = await this.userService.getUserByResetToken(token || "");
    if (!user)
      return {
        status: HttpStatus.NOT_FOUND,
        success: false,
        message: "User not found",
      };

    if (differenceInMinutes(new Date(), user.resetPasswordExpires || "") > 0) {
      return {
        status: HttpStatus.BAD_REQUEST,
        success: false,
        message: "Token expired",
      };
    }

    await this.userService.updateById(user._id.toString(), {
      password: await hash(newPassword ?? "", 10),
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });

    return {
      status: HttpStatus.OK,
      success: true,
      message: "Password updated successfully",
      data: user.email,
    };
  }
    */
}
