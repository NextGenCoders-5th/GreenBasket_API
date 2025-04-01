import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function EmailOrPhone(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'eitherEmailOrPhone',
      target: object.constructor,
      options: validationOptions,
      propertyName,
      validator: {
        validate(_value: any, args: ValidationArguments) {
          const { email, phoneNumber } = args.object as any;
          return !!(email || phoneNumber);
        },
        defaultMessage() {
          return 'Email or Phone Number must be provided.';
        },
      },
    });
  };
}
