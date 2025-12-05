import { addDays } from "date-fns"

export class Usuario{
    id: number
    nome: string
    diasBloqueado?: number
    inicioPunicao?: Date | null
    fimPunicao?: Date | null
    bloqueado?: boolean

    constructor(id: number, nome: string){
        this.id = id
        this.nome = nome
    }

    calculaDiaVolta(diasBloqueado: number, em: Date) :Date{
       return this.fimPunicao = addDays(em, diasBloqueado)
    }
}