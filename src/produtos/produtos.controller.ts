import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common"
import { AtualizaProdutoDTO } from "src/dto/atualizaProdutoDTO";
import { CriaProdutoDTO } from "src/dto/criaProdutoDTO";
import { ListaProdutoDTO } from "src/dto/listaProdutoDTO";
import { Produto } from "src/models/produto.entity";
import { ProdutoService } from "./produto.service";

@Controller('/produtos')
export class ProdutosController {
    constructor(private produtosService: ProdutoService) { }

    @Post()
    async criarProduto(@Body() produto: CriaProdutoDTO) {
        const produtoCriado = { ...produto } as Produto;
        const idNovoProduto = await this.produtosService.create(produtoCriado);

        return {
            id: idNovoProduto,
            message: "Novo produto criado com sucesso!"
        };
    }

    @Get()
    async buscarTodos() {
        const produtos = await this.produtosService.findAll();

        return produtos.map(({ id, nome, valor, descricao, categoria, dataCriacao, dataAtualizacao }) => {
            return {
                id, nome, valor, descricao, categoria, dataCriacao, dataAtualizacao
            } as ListaProdutoDTO
        });
    }

    @Put(':id')
    async atualizarProduto(@Param('id') id: string, @Body() produtoAtualizadoDto: AtualizaProdutoDTO) {
        const produtoAtualizado = await this.produtosService.update(id, produtoAtualizadoDto);

        return {
            id: produtoAtualizado.id,
            nome: produtoAtualizado.nome,
            valor: produtoAtualizado.valor,
            descricao: produtoAtualizado.descricao,
            categoria: produtoAtualizado.categoria,
            dataCriacao: produtoAtualizado.dataCriacao,
            dataAtualizacao: produtoAtualizado.dataAtualizacao,
            message: "Produto atualizado com sucesso!"
        };
    }

    @Delete(':id')
    async removerProduto(@Param('id') id: string) {
        const produtoRemovido = await this.produtosService.delete(id);

        return {
            id: produtoRemovido.id,
            message: "Produto removido com sucesso!"
        };
    }   
}