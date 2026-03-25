import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isBefore', async: false })
export class IsBeforeConstraint implements ValidatorConstraintInterface {

    validate(propertyValue: string, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];

        if (!propertyValue || !relatedValue) {
            return true;
        }

        const startDate = new Date(propertyValue);
        const endDate = new Date(relatedValue);
        return startDate <= endDate;
    }
    defaultMessage(args: ValidationArguments) {
        return `Start date cannot be later than end date.`;
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
