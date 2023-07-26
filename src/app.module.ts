import { Module } from '@nestjs/common';
import { ProdutosModule } from './produtos/produtos.module';
import { UsuariosModules } from './usuarios/usuarios.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './config/postgres.config.service';
import { PedidoModule } from './pedido/pedido.module';
import { GlobalFilterExceptions } from './filters/global-filter-exceptions';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    UsuariosModules,
    ProdutosModule,
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    PedidoModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalFilterExceptions,
    },
  ],
})
export class AppModule {}
