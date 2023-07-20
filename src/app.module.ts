import { Module } from '@nestjs/common';
import { ProdutosModule } from './produtos/produtos.module';
import { UsuariosModules } from './usuarios/usuarios.module';

@Module({
  imports: [UsuariosModules, ProdutosModule]
})
export class AppModule {}
