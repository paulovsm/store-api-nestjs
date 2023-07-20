import { IsNotEmpty, IsUrl } from "class-validator";
import { Produto } from "src/models/produto.entity";

export class ImagemProdutoDTO {
    id: string;

    @IsUrl({}, {message: 'A URL da imagem deve ser válida'})
    url: string;
    
    @IsNotEmpty({message: 'A descrição da imagem não pode ser vazia'})
    descricao: string;

    produto: Produto;
}