import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsUUID, MaxLength, Min, ValidateNested } from "class-validator";
import { CaracteristicaProdutoDTO } from "./caracteristicaProdutoDTO"
import { ImagemProdutoDTO } from "./imagemProdutoDTO"

export class AtualizaProdutoDTO {
    @IsNotEmpty({ message: 'O nome do produto não pode ser vazio' })
    @IsOptional()
    nome: string;

    @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false }, { message: 'O valor do produto deve ser um número' })
    @Min(1, { message: 'O valor do produto deve ser maior que zero' })
    @IsOptional()
    valor: number;

    @IsNumber({}, { message: 'A quantidade disponível do produto deve ser um número' })
    @Min(1, { message: 'A quantidade disponível do produto deve ser maior que zero' })
    @IsOptional()
    quantidadeDisponivel: number;

    @IsNotEmpty({ message: 'A descrição do produto não pode ser vazia' })
    @MaxLength(1000, { message: 'A descrição do produto deve ter no máximo 1000 caracteres' })
    @IsOptional()
    descricao: string;

    @IsArray({ message: 'As características do produto devem ser um array' })
    @ValidateNested({ each: true, message: 'As características do produto devem ser um array de objetos' })
    @Type(() => CaracteristicaProdutoDTO)
    @ArrayMinSize(3, { message: 'O produto deve ter no mínimo 3 características' })
    @IsOptional()
    caracteristicas: CaracteristicaProdutoDTO[];

    @IsArray({ message: 'As imagens do produto devem ser um array' })
    @ValidateNested({ each: true, message: 'As imagens do produto devem ser um array de objetos' })
    @Type(() => ImagemProdutoDTO)
    @ArrayMinSize(1, { message: 'O produto deve ter no mínimo 1 imagem' })
    @IsOptional()
    imagens: ImagemProdutoDTO[];

    @IsNotEmpty({ message: 'A categoria do produto não pode ser vazia' })
    @IsOptional()
    categoria: string;

    @IsDateString({}, { message: 'A data de criação do produto deve ser uma data válida' })
    @IsOptional()
    dataCriacao: Date;

    @IsDateString({}, { message: 'A data de atualização do produto deve ser uma data válida' })
    @IsOptional()
    dataAtualizacao: Date;
}