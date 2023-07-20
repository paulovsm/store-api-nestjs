import { Module } from "@nestjs/common";
import { ProdutoRepository } from "./produto.repository";
import { ProdutosController } from "./produtos.controller";

@Module({
    controllers: [ProdutosController],
    providers: [ProdutoRepository],
})
export class ProdutosModule {}