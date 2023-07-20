import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Produto } from "./produto.entity";

@Entity({ name: 'caracteristicas_produto' })
export class CaracteristicaProduto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: 'nome', length: 100, nullable: false })
    nome: string;

    @Column({name: 'descricao', length: 255, nullable: false })
    descricao: string;

    @ManyToOne(
        () => Produto, 
        produto => produto.caracteristicas,
        { orphanedRowAction: 'delete', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    produto: Produto
}