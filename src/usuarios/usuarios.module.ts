import { Module } from "@nestjs/common";
import { EmailUsuarioUnicoValidator } from "src/validators/EmailUsuarioUnicoValidator";
import { UsuarioRepository } from "./usuario.repository";
import { UsuarioController } from "./usuarios.controller";

@Module({
    controllers: [UsuarioController],
    providers: [UsuarioRepository, EmailUsuarioUnicoValidator]
})
export class UsuariosModules {
    
}