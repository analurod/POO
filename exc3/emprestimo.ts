import { differenceInDays } from 'date-fns'
import { Usuario } from "./usuario"
import { Exemplar } from "./exemplar"

export class Emprestimo{
    inicio?: Date
    fim?: Date
    dataDevida?: Date
    estado: 'Rascunho' | 'Ativo' | 'Concluido' = 'Rascunho'
    
    constructor(
        public readonly usuario: Usuario, 
        public readonly exemplar: Exemplar
    ){}

    
    diasAtraso(agora: Date): number{
        if(!this.inicio || !this.dataDevida) return 0

        const fim: Date = this.fim ?? agora
        const dias: number = Math.max(0, differenceInDays(fim, this.dataDevida))
        return dias
    }
}