import { IsEmail, IsNotEmpty } from "class-validator";

export class PasswordResetTokenDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;
  }