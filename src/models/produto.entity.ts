import { CaracteristicaProduto } from "./caracteristicaProduto"
import { ImagemProduto } from "./imagemProduto"

export interface Produto {
    id: string,
    nome: string,
    valor: number,
    quantidadeDisponivel: number,
    descricao: string,
    caracteristicas: CaracteristicaProduto[],
    imagens: ImagemProduto[],
    categoria: string,
    dataCriacao: Date,
    dataAtualizacao: Date,
    usuarioId: string
}