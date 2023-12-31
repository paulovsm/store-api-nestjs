import { Pedido } from '../pedido/pedido.entity';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'usuarios' })
export class Usuario {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    nome: string;

    @Column({ type: 'varchar', length: 70, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    senha: string;

    @OneToMany(() => Pedido, pedido => pedido.usuario, { cascade: true, eager: true } )
    pedidos: Pedido[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
    deletedAt: Date;
}