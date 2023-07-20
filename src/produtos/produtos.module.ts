import { Module } from "@nestjs/common";
import { ProdutoService } from "./produto.service";
import { ProdutosController } from "./produtos.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Produto } from "src/models/produto.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Produto])],
    controllers: [ProdutosController],
    providers: [ProdutoService],
})
export class ProdutosModule {}