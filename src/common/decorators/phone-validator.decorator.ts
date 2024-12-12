import { 
    registerDecorator, 
    ValidationOptions, 
    ValidatorConstraint, 
    ValidatorConstraintInterface, 
    ValidationArguments 
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(phone: any, args: ValidationArguments) {
    const phoneRegex = /^\+56 9 \d{4} \d{4}$/;
    return typeof phone === 'string' && phoneRegex.test(phone);
  }

  defaultMessage(args: ValidationArguments) {
    return 'El número de teléfono no es válido. Debe tener el formato: +56 9 0000 0000.';
  }
}

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberConstraint,
    });
  };
}