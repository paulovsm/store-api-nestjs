import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";
import { IsEmailUsuarioUnico } from "src/validators/EmailUsuarioUnicoValidator";

export class AtualizaUsuarioDTO {
    @IsNotEmpty({ message: 'O nome não pode ser vazio' })
    @IsOptional()
    nome: string;
    
    @IsEmail({}, { message: 'O email deve ser válido' })
    @IsEmailUsuarioUnico()
    @IsOptional()
    email: string;

    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    @IsOptional()
    senha: string;
}