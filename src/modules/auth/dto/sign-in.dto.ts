import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class SignInDto {
  @IsEmail({}, { message: "Email is not valid" })
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: "Password is not valid" })
  @MaxLength(20, { message: "Password is not valid" })
  password!: string;
}
