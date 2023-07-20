import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Produto } from "./produto.entity";

@Entity({ name: 'imagem_produto' })
export class ImagemProduto {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ name: 'url', length: 255, nullable: false })
    url: string;

    @Column({ name: 'descricao', length: 255, nullable: false })
    descricao: string

    @ManyToOne(
        () => Produto, 
        produto => produto.imagens,
        { orphanedRowAction: 'delete', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    produto: Produto
}