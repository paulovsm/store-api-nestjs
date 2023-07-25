import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { StatusPedido } from './enum/statuspedido.enum';
import { Usuario } from '../models/usuario.entity';
import { ItemPedido } from './itemPedido.entity';

@Entity({ name: 'pedidos' })
export class Pedido {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'valor_total', nullable: false })
    valorTotal: number;

    @Column({ name: 'status', enum: StatusPedido, nullable: false })
    status: StatusPedido;

    @ManyToOne(() => Usuario, 
        usuario => usuario.pedidos, 
        { orphanedRowAction: 'delete', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    usuario: Usuario;

    @OneToMany(() => ItemPedido, 
        (itemPedido) => itemPedido.pedido,
        { cascade: true, eager: true }
    )
    itensPedido: ItemPedido[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: string;
}
