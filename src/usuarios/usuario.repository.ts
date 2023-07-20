import { Usuario } from "../models/usuario";
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsuarioRepository {
    private usuarios: Usuario[] = [];

    async criar(usuario: Usuario): Promise<string> {
        const id = uuidv4();
        usuario.id = id;

        this.usuarios.push(usuario);

        return id;
    }

    async buscarPorEmail(email: string): Promise<Usuario> {
        return this.usuarios.find(usuario => usuario.email === email);
    }

    async buscarPorId(id: string): Promise<Usuario> {
        return this.usuarios.find(usuario => usuario.id === id);
    }

    //Retorna todos os usuários de forma imutável
    async buscarTodos(): Promise<Usuario[]> {
        return [...this.usuarios];
    }

    async atualizar(id: string, usuarioAtualizado: Partial<Usuario>): Promise<Usuario> {
        const usuario = await this.buscarUsarioExistente(id);

        Object.entries(usuarioAtualizado).forEach(([chave, valor]) => {
            if (chave === 'id') {
                return;
            }

            if (valor) {
                usuario[chave] = valor;
            }
        });

        return usuario;
    }

    async remover(id: string): Promise<Usuario> {
        const usuario = await this.buscarUsarioExistente(id);

        this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);

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


