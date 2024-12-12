import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";
import { isValidObjectId } from "mongoose";

export class RelateParentStudentDto {
  @IsMongoObjectId({ message: "Id Apoderado debe ser una id de mongo válida" })
  parentId!: string;

  @IsMongoObjectId({ message: "Id Hijo debe ser una id de mongo válida" })
  childId!: string;
}

function IsMongoObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isMongoObjectId",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isValidObjectId(value); // Valida si el valor es un ObjectId válido
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid MongoDB ObjectId`;
        },
      },
    });
  };
}
