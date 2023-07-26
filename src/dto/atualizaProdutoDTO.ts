import { PartialType } from "@nestjs/mapped-types";
import { CriaProdutoDTO } from "./criaProdutoDTO";

export class AtualizaProdutoDTO extends PartialType(CriaProdutoDTO){
}