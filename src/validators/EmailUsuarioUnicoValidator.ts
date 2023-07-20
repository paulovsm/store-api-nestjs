import { Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { UsuarioService } from "src/usuarios/usuario.service";

@Injectable()
@ValidatorConstraint({ name: 'emailUnico', async: true })
export class EmailUsuarioUnicoValidator implements ValidatorConstraintInterface {
    constructor(private usuarioService: UsuarioService) {}

    async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        const usuario = await this.usuarioService.buscarPorEmail(value);
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
