import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CaracteristicaProduto } from "./caracteristicaProduto"
import { ImagemProduto } from "./imagemProduto"

@Entity({ name: 'produtos'})
export class Produto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    nome: string;

    @Column({ nullable: false })
    valor: number;

    @Column({ nullable: false })
    quantidadeDisponivel: number;

    @Column({ length: 255, nullable: false })
    descricao: string;

    caracteristicas: CaracteristicaProduto[];
    imagens: ImagemProduto[];

    @Column({ nullable: false })
    categoria: string;

    @Column({ nullable: false })
    dataCriacao: Date;

    @Column({ nullable: false })
    dataAtualizacao: Date;

    @Column({ name: 'usuario_id', length: 100, nullable: false })
    usuarioId: string;
}