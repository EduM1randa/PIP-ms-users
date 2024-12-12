import { 
    IsString, 
    IsNotEmpty, 
    IsOptional, 
    IsArray, 
    IsMongoId, 
    ArrayMaxSize,
    Matches,
} from 'class-validator';
import { IsValidName } from 'src/common/decorators/names-validator.decorator';
import { IsPhoneNumber } from 'src/common/decorators/phone-validator.decorator';
import { IsRut } from 'src/common/decorators/rut-validator.decorator';

export class CreateStudentDto {
    @IsString()
    @IsNotEmpty()
    @IsValidName()
    names?: string;

    @IsString()
    @IsNotEmpty()
    @IsValidName()
    lastNames?: string;

    @IsRut()
    @IsString()
    @IsNotEmpty()
    rut?: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^\d{2}-\d{2}-\d{4}$/, { message: 'La fecha debe tener el formato dd-mm-yyyy' })
    birthday?: string;

    @IsString()
    @IsNotEmpty()
    address?: string;

    @IsString()
    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @IsArray()
    @ArrayMaxSize(2)
    @IsMongoId({ each: true })
    @IsOptional()
    parents?: string[];

    @IsMongoId()
    @IsNotEmpty()
    courseId?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    medicalObservations?: string[];
}