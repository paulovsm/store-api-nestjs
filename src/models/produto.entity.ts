import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CaracteristicaProduto } from "./caracteristicaProduto"
import { ImagemProduto } from "./imagemProduto"

@Entity({ name: 'produtos'})
export class Produto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    nome: string;
    valor: number;
    quantidadeDisponivel: number;
    descricao: string;
    caracteristicas: CaracteristicaProduto[];
    imagens: ImagemProduto[];
    categoria: string;
    dataCriacao: Date;
    dataAtualizacao: Date;

    @Column({ name: 'usuario_id', length: 100, nullable: false })
    usuarioId: string;
}