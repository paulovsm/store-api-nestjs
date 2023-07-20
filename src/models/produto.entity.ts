import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { CaracteristicaProduto } from "./caracteristicaProduto.entity"
import { ImagemProduto } from "./imagemProduto.entity"

@Entity({ name: 'produtos'})
export class Produto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'usuario_id', length: 100, nullable: false })
    usuarioId: string;

    @Column({ name: 'nome', length: 100, nullable: false })
    nome: string;

    @Column({ name: 'valor', nullable: false })
    valor: number;

    @Column({ name: 'quantidade_disponivel', nullable: false })
    quantidadeDisponivel: number;

    @Column({ length: 255, nullable: false })
    descricao: string;

    @Column({ name: 'categoria', length: 100, nullable: false })
    categoria: string;

    @OneToMany(
        () => CaracteristicaProduto, 
        caracteristicaProduto => caracteristicaProduto.produto,
        { cascade: true, eager: true } )
    caracteristicas: CaracteristicaProduto[];

    @OneToMany(
        () => ImagemProduto, 
        imagemProduto => imagemProduto.produto,
        { cascade: true, eager: true })
    imagens: ImagemProduto[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    dataCriacao: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    dataAtualizacao: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
    dataRemocao: Date;
}