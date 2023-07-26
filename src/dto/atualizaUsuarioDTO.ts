import { PartialType } from "@nestjs/mapped-types";
import { CriaUsuarioDTO } from "./criaUsuarioDTO";

export class AtualizaUsuarioDTO extends PartialType(CriaUsuarioDTO) {
}