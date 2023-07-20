import { IsNotEmpty } from "class-validator";
import { Produto } from "src/models/produto.entity";

export class CaracteristicaProdutoDTO {
    id: string;

    @IsNotEmpty({message: 'O nome da característica não pode ser vazio'})
    nome: string;
    @IsNotEmpty({message: 'A descrição da característica não pode ser vazia'})
    descricao: string;

    produto: Produto;
}