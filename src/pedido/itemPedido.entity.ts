import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
} from 'typeorm';
import { Pedido } from './pedido.entity';
import { Produto } from '../models/produto.entity';

@Entity({ name: 'itens_pedidos' })
export class ItemPedido {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'quantidade', nullable: false })
    quantidade: number;

    @Column({ name: 'preco_venda', nullable: false })
    precoVenda: number;

    @ManyToOne(() => Pedido, (pedido) => pedido.itensPedido, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    pedido: Pedido;

    @ManyToOne(() => Produto, (produto) => produto.itensPedido, {
        cascade: ['update']
    })
    produto: Produto;

}
