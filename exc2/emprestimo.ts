import { Usuario } from "./usuario"
import { Exemplar } from "./exemplar"

export class Emprestimo{
    inicio?: Date
    fim?: Date
    estado: 'Rascunho' | 'Ativo' | 'Concluido' = 'Rascunho'
    
    constructor(
        public readonly usuario: Usuario, 
        public readonly exemplar: Exemplar
    ){}

    
    diasAtraso(agora: Date): number{
        if(!this.inicio) return 0

        const fim = this.fim ?? agora
        const dias = Math.ceil((fim.getTime() - this.inicio.getTime()) / (1000 * 60 * 60 * 24))
        return Math.max(0, dias - 14)
    }
}