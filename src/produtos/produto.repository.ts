import { Produto } from "src/models/produto.entity";
import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProdutoRepository {
    private produtos: Produto[] = [];

    async create(produto: Produto) {
        const id = uuidv4();
        produto.id = id;
        this.produtos.push(produto);
        return id;
    }

    async findAll(): Promise<Produto[]> {
        return [...this.produtos];
    }

    async findById(id: string): Promise<Produto> {
        return this.produtos.find(produto => produto.id === id);
    }

    async update(id: string, produto: Partial<Produto>): Promise<Produto> {
        const produtoExistente = await this.findProduct(id);

        Object.entries(produto).forEach(([chave, valor]) => {
            if (chave === 'id' || chave === 'usuarioId') {
                return;
            }

            if (valor) {
                produtoExistente[chave] = valor;
            }
        });

        produtoExistente.dataAtualizacao = new Date();

        return produtoExistente;

    }

    async delete(id: string): Promise<Produto> {
        const produtoExistente = await this.findProduct(id);

        this.produtos = this.produtos.filter(produto => produto.id !== id);

        return produtoExistente;
    }


    private async findProduct(id: string) : Promise<Produto> {
        const produto = await this.findById(id);

        if (!produto) {
            throw new Error('Produto não encontrado');
        }

        return produto;
    }
}