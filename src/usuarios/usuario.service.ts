import { Usuario } from "../models/usuario.entity";
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>
    ) { }

    async criar(usuario: Usuario): Promise<string> {
        const novoUsuario = await this.usuarioRepository.save(usuario);

        return novoUsuario.id;
    }

    async buscarPorEmail(email: string): Promise<Usuario> {
        const listaUsuarios = await this.usuarioRepository.findBy({ email });

        if (listaUsuarios.length > 0) {
            return listaUsuarios[0];
        } else {
            return null;
        }
    }

    async buscarPorId(id: string): Promise<Usuario> {
        const listaUsuarios = await this.usuarioRepository.findBy({ id });

        if (listaUsuarios.length > 0) {
            return listaUsuarios[0];
        }

        return null;
    }

    //Retorna todos os usuários de forma imutável
    async buscarTodos(): Promise<Usuario[]> {
        return await this.usuarioRepository.find();;
    }

    async atualizar(id: string, usuarioAtualizado: Partial<Usuario>): Promise<Usuario> {
        const usuario = await this.buscarUsarioExistente(id);

        await this.usuarioRepository.update(id, usuarioAtualizado);

        const usuarioAtualizadoDb = await this.buscarUsarioExistente(id);

        return usuarioAtualizadoDb;
    }

    async remover(id: string): Promise<Usuario> {
        const usuario = await this.buscarUsarioExistente(id);

        await this.usuarioRepository.delete(id);

        return usuario;
    }

    private async buscarUsarioExistente(id: string) {
        const usuario = await this.buscarPorId(id);

        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        return usuario;
    }

}


