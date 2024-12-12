import { IsDate, IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class EditUserDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsNumber()
    age?: number;

    @IsOptional()
    @IsString()
    resetPasswordToken?: string;

    @IsOptional()
    @IsDate()
    resetPasswordExpires?: Date;
}
