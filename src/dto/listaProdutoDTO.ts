export interface ListaProdutoDTO {
    id: string;
    nome: string;
    valor: number;
    descricao: string;
    categoria: string;
    dataCriacao: Date;
    dataAtualizacao: Date;
    usuarioId: string;
}