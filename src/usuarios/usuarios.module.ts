import { Module } from "@nestjs/common";
import { EmailUsuarioUnicoValidator } from "src/validators/EmailUsuarioUnicoValidator";
import { UsuarioService } from "./usuario.service";
import { UsuarioController } from "./usuarios.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario } from "src/models/usuario.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Usuario])],
    controllers: [UsuarioController],
    providers: [UsuarioService, EmailUsuarioUnicoValidator]
})
export class UsuariosModules {
    
}