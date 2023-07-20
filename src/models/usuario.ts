import { Entity, Column } from 'typeorm';

@Entity({ name: 'usuarios' })
export class Usuario {
    @Column({ type: 'varchar', length: 36 })
    id: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    nome: string;

    @Column({ type: 'varchar', length: 70, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    senha: string;
}