import { Injectable, Inject } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from './pedido.entity';
import { Usuario } from 'src/models/usuario.entity';
import { In, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { StatusPedido } from './enum/statuspedido.enum';
import { ItemPedido } from './itemPedido.entity';
import { Produto } from 'src/models/produto.entity';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Usuario)
    private readonly produtoRepository: Repository<Produto>,
  ) { }

  async create(createPedidoDto: CreatePedidoDto, usuarioId: string) {
    const pedido = new Pedido();
    const usuario = await this.usuarioRepository.findOneBy({ id: usuarioId });
    const produtosIds = createPedidoDto.itensPedido.map((itemPedido) => itemPedido.produtoId);
    const produtosRelacionados = await this.produtoRepository.findBy({ id: In(produtosIds) });

    Object.assign(pedido, createPedidoDto);

    const itensPedidos = createPedidoDto.itensPedido.map((itemPedido) => {
      const itemPedidoEntity = new ItemPedido();
      const produtoRelacionado = produtosRelacionados.find(
        (produto) => produto.id === itemPedido.produtoId,
      );

      itemPedidoEntity.produto = produtoRelacionado;
      itemPedidoEntity.precoVenda = produtoRelacionado.valor;
      itemPedidoEntity.quantidade = itemPedido.quantidade;
      itemPedidoEntity.produto.quantidadeDisponivel -= itemPedido.quantidade;
      
      return itemPedidoEntity
    })

    const valorTotal = itensPedidos.reduce((total, item) => {
      return total + item.precoVenda * item.quantidade
    }, 0);

    pedido.itensPedido = itensPedidos;
    pedido.valorTotal = valorTotal;
    pedido.status = StatusPedido.EM_PROCESSAMENTO;
    pedido.usuario = usuario;

    const pedidoCriado = await this.pedidoRepository.save(pedido);

    if (!pedidoCriado) {
      throw new Error('Erro ao criar pedido');
    }

    return pedidoCriado.id;
  }

  async findAll(): Promise<Pedido[]> {
    return await this.pedidoRepository.find();
  }

  async findById(id: string): Promise<Pedido> {
    const pedidoList = await this.pedidoRepository.findBy({ id });

    if (pedidoList.length > 0) {
      return pedidoList[0];
    } else {
      throw new Error('Pedido não encontrado');
    }

  }

  async getPedidoByUsuario(usuarioId: string): Promise<Pedido[]> {
    const pedidos = await this.pedidoRepository.find({
      where: {
        usuario: { id: usuarioId },
      },
      relations: {
        usuario: true,
      },
    });

    return pedidos;
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const pedidoExistente = await this.findPedido(id);

    Object.assign(pedidoExistente, updatePedidoDto);

    await this.pedidoRepository.save(pedidoExistente);

    return pedidoExistente;
  }

  async remove(id: string): Promise<Pedido> {
    const pedidoExistente = await this.findPedido(id);

    await this.pedidoRepository.delete(id);

    return pedidoExistente;
  }

  private async findPedido(id: string): Promise<Pedido> {
    const pedido = await this.findById(id);

    if (!pedido) {
      throw new Error('Produto não encontrado');
    }

    return pedido;
  }
}
