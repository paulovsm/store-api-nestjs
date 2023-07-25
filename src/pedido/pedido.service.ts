import { Injectable, Inject } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from './pedido.entity';
import { Usuario } from 'src/models/usuario.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) { }

  async create(createPedidoDto: CreatePedidoDto) {
    const pedido = new Pedido();
    Object.assign(pedido, createPedidoDto);
    const pedidoCriado = await this.pedidoRepository.save(pedido);

    if(!pedidoCriado) {
        throw new Error('Erro ao criar pedido');
    }

    return pedidoCriado.id;
  }

  async findAll(): Promise<Pedido[]> {
    return await this.pedidoRepository.find();
  }

  async findOne(id: string): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({ id });

    if (!pedido) {
        throw new Error('Pedido não encontrado');
    }

    return pedido;
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const pedidoExistente = await this.findOne(id);

    Object.assign(pedidoExistente, updatePedidoDto);

    await this.pedidoRepository.save(pedidoExistente);

    return pedidoExistente;
  }

  async remove(id: string): Promise<Pedido> {
    const pedidoExistente = await this.findOne(id);

    await this.pedidoRepository.delete(id);

    return pedidoExistente;
  }
}
