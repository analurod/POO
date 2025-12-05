export class Usuario{
    id: number
    nome: string
    emprestimosAtuais: number = 0

    constructor(id: number, nome: string){
        this.id = id
        this.nome = nome
    }
}