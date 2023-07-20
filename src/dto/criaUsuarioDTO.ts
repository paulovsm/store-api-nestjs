import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { IsEmailUsuarioUnico } from "src/validators/EmailUsuarioUnicoValidator";

export class CriaUsuarioDTO {
    @IsNotEmpty({ message: 'O nome não pode ser vazio'})
    nome: string;
    @IsEmail({}, { message: 'O email deve ser válido' })
    @IsEmailUsuarioUnico()
    email: string;
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    senha: string;
}