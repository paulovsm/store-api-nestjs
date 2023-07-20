import { IsNotEmpty, IsUrl } from "class-validator";

export class ImagemProdutoDTO {
    @IsUrl({}, {message: 'A URL da imagem deve ser válida'})
    url: string;
    @IsNotEmpty({message: 'A descrição da imagem não pode ser vazia'})
    descricao: string;
}