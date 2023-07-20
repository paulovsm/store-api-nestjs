import { Produto } from "src/models/produto.entity";
import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ProdutoService {

    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>
    ) { }

    async create(produto: Produto) {
        const produtoCriado = await this.produtoRepository.save(produto);

        if(!produtoCriado) {
            throw new Error('Erro ao criar produto');
        }

        return produtoCriado.id;
    }

    async findAll(): Promise<Produto[]> {
        return await this.produtoRepository.find();
    }

    async findById(id: string): Promise<Produto> {
        const listaProdutos = await this.produtoRepository.findBy({ id });

        if (listaProdutos.length > 0) {
            return listaProdutos[0];
        } else {
            throw new Error('Produto não encontrado');
        }

    }

    async update(id: string, produto: Partial<Produto>): Promise<Produto> {
        const produtoExistente = await this.findProduct(id);

        await this.produtoRepository.update(id, produto);

        return produtoExistente;

    }

    async delete(id: string): Promise<Produto> {
        const produtoExistente = await this.findProduct(id);

        await this.produtoRepository.delete(id);

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