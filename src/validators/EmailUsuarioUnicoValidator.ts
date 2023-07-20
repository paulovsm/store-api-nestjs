import { Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { UsuarioRepository } from "src/usuarios/usuario.repository";

@Injectable()
@ValidatorConstraint({ name: 'emailUnico', async: true })
export class EmailUsuarioUnicoValidator implements ValidatorConstraintInterface {
    constructor(private usuarioRepository: UsuarioRepository) {}

    async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        const usuario = await this.usuarioRepository.buscarPorEmail(value);
        return !usuario;
    }

    defaultMessage?(validationArguments?: ValidationArguments): string {
        return `O email ${validationArguments.value} já está cadastrado`;
    }

}

export function IsEmailUsuarioUnico(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions ? validationOptions : {
                message: `O email $value já está cadastrado`,
            },
            constraints: [],
            validator: EmailUsuarioUnicoValidator,
        });
    };
}
