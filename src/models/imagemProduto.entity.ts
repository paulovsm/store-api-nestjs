import { Column, Entity } from "typeorm"

@Entity({ name: 'imagem_produto' })
export class ImagemProduto {
    @Column({ name: 'url', length: 255, nullable: false })
    url: string;

    @Column({ name: 'descricao', length: 255, nullable: false })
    descricao: string
}