import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './pedido.entity';
import { Usuario } from '../models/usuario.entity';
import { Produto } from 'src/models/produto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, Usuario, Produto])],
  controllers: [PedidoController],
  providers: [PedidoService]
})
export class PedidoModule {}
