import { Module } from '@nestjs/common';
import { ProdutosModule } from './produtos/produtos.module';
import { UsuariosModules } from './usuarios/usuarios.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './config/postgres.config.service';
import { PedidoModule } from './pedido/pedido.module';

@Module({
  imports: [
    UsuariosModules,
    ProdutosModule,
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    PedidoModule,
  ]
})
export class AppModule {}
