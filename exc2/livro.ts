export class Livro{
    titulo: string
    autor: string
    editora: string
    genero: string
    ano: number

    constructor(titulo: string, autor:string, editora: string, genero: string, ano: number){
        this.titulo = titulo
        this.autor = autor
        this.editora = editora
        this.genero = genero
        this.ano = ano
    }
}