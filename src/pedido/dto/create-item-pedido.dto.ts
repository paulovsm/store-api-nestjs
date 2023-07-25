import { IsInt, IsUUID } from 'class-validator';

export class ItemPedidoDto {
    @IsUUID()
    produtoId: string;
    
    @IsInt()
    quantidade: number;
}