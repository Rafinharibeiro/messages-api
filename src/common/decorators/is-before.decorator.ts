import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';


@ValidatorConstraint({ name: 'isBefore', async: false })
export class IsBeforeConstraint implements ValidatorConstraintInterface {


    validate(value: any, args: ValidationArguments): boolean {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];

        if (!value || !relatedValue) {
            return true;
        }
        const start = value instanceof Date ? value : new Date(value);
        const end = relatedValue instanceof Date ? relatedValue : new Date(relatedValue);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return false;
        }
        return start <= end;
    }


    defaultMessage(args: ValidationArguments): string {
        const [relatedPropertyName] = args.constraints;
        return `${args.property} cannot be later than ${relatedPropertyName}`;
    }
}

export function IsBefore(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: IsBeforeConstraint,
        });
    };
}