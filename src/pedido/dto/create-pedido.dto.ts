import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, ValidateNested } from 'class-validator';
import { ItemPedidoDto } from './create-item-pedido.dto';

export class CreatePedidoDto {
    @ValidateNested()
    @IsArray()
    @ArrayMinSize(1)
    @Type(() => ItemPedidoDto)
    itensPedido: ItemPedidoDto[];
  }