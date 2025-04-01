import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function CheckPasswordConfirm(options: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      propertyName,
      target: object.constructor,
      name: 'checkPasswordConfirm',
      options,
      validator: {
        validate(_value: any, args: ValidationArguments) {
          const { password, passwordConfirm } = args.object as any;

          return !!(password === passwordConfirm);
        },
        defaultMessage() {
          return 'password and password confirm should be the same';
        },
      },
    });
  };
}
