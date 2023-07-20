import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AtualizaUsuarioDTO } from "src/dto/atualizaUsuarioDTO";
import { CriaUsuarioDTO } from "src/dto/criaUsuarioDTO";
import { ListaUsuarioDTO } from "src/dto/listaUsuarioDTO";
import { Usuario } from "../models/usuario.entity";
import { UsuarioService } from "./usuario.service";

@Controller('/usuarios')
export class UsuarioController {
    constructor(
        private usuarioService: UsuarioService) { }

    @Post()
    async criarUsuario(@Body() usuario: CriaUsuarioDTO) {
        const usuarioCriado = { ...usuario} as Usuario;
        const idNovoUsuario = await this.usuarioService.criar(usuarioCriado);
        
        return {
            id: idNovoUsuario,
            message: "Novo usuário criado com sucesso!"
        };
    }

    @Get()
    async buscarTodos(): Promise<ListaUsuarioDTO[]> {
        const usuarios = await this.usuarioService.buscarTodos();
        return usuarios.map(usuario => {
            return {
                id: usuario.id,
                nome: usuario.nome
            } as ListaUsuarioDTO 
        });
    }

    @Put(':id')
    async atualizarUsuario(@Param('id') id: string, @Body() usuarioAtualizadoDto: AtualizaUsuarioDTO) {
        const usuarioAtualizado =  await this.usuarioService.atualizar(id, usuarioAtualizadoDto);
        
        return {
            id: usuarioAtualizado.id,
            nome: usuarioAtualizado.nome,
            email: usuarioAtualizado.email,
            message: "Usuário atualizado com sucesso!"
        };
    }

    @Delete(':id')
    async removerUsuario(@Param('id') id: string) {
        const usuarioRemovido = await this.usuarioService.remover(id);
        
        return {
            id: usuarioRemovido.id,
            message: "Usuário removido com sucesso!"
        };
    }
}