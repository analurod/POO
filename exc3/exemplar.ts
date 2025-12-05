import { Emprestimo } from "./emprestimo";
import { Livro } from "./livro";

export class Exemplar{
    status: 'Disponível' | 'Emprestado' | 'Danificado' = 'Disponível'

    constructor(
        public readonly id: number,
        public readonly livro: Livro,
    ){}
    
}