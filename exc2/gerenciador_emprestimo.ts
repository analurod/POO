import { Usuario } from "./usuario"
import { Exemplar } from "./exemplar"
import { Livro } from "./livro"
import { Emprestimo } from "./emprestimo"

class GerenciadorEmprestimos{
    constructor(
        public usuarios: Map<string, Usuario>,
        public exemplares: Map<string, Exemplar>,
    ){}

    inicioEmprestimo(usuario: Usuario, exemplar: Exemplar, emprestimo: Emprestimo, em: Date): void{
        if(exemplar.status !== 'Disponível'){
            throw Error(`Exemplar não disponível para emprestimo! Status: ${exemplar.status}`)
        }
        if(emprestimo.estado != 'Rascunho'){
            throw Error(`Emprestimo já iniciado! Status: ${emprestimo.estado}`)
        }
        if(usuario.emprestimosAtuais >= 3){
            throw Error(`Usúario já atingiu limite de emprestimos!`)
        }

        emprestimo.inicio = em
        usuario.emprestimosAtuais +=1
        exemplar.status = 'Emprestado'
        emprestimo.estado = 'Ativo'

        console.log(`Emprestimo: ${emprestimo.estado} em ${em}:
           Usuário: ${usuario.nome}
           Livros Atuais em Emprestimo: ${usuario.emprestimosAtuais}
           Exemplar: ${exemplar.livro.titulo}
        `)
    }

    concluiEmprestimo(usuario: Usuario, exemplar: Exemplar, emprestimo: Emprestimo, em: Date): void{
        if(emprestimo.estado != 'Ativo'){
            throw Error(`Emprestimo não está ativo! Status: ${emprestimo.estado}`)
        }

        emprestimo.fim = em
        usuario.emprestimosAtuais -=1
        exemplar.status = 'Disponível'
        emprestimo.estado = 'Concluido'
        const atraso = emprestimo.diasAtraso(em)
        
        console.log(`Emprestimo: ${emprestimo.estado} em ${em}:
           Usuário: ${usuario.nome}
           Livros Atuais em Emprestimo: ${usuario.emprestimosAtuais}
           Exemplar: ${exemplar.livro.titulo}
           Dias em Atraso: ${atraso}
        `)
    }

}

function main(){
    const usuariosMap = new Map<string, Usuario>()
    const exemplarMap = new Map<string, Exemplar>()

    // Usuários
    const usuarios: Usuario[] = [
        new Usuario(1, "Alice"),
        new Usuario(2, "Bruno"),
        new Usuario(3, "Carla"),
        new Usuario(4, "Diego"),
        new Usuario(5, "Eduarda"),
    ]

    usuarios.forEach(u => {
        usuariosMap.set(String(u.id), u); 
    })

    // Livros
    const livros: Livro[] = [
    new Livro("Dom Casmurro", "Machado de Assis", "Conjunto das Letrinhas", "Realismo psicológico, romance impressionista", 1899),
    new Livro("O Hobbit", "J. R. R. Tolkien", "Hora da Ficção", "Fantasia Juvenil", 1937),
    new Livro("A Moreninha", "Joaquim Manuel de Macedo", "Conjunto das Letrinhas", "Romance", 1844),
    new Livro("Capitães da Areia", "Jorge Amado", "Conjunto das Letrinhas", "Romance", 1937),
    new Livro("A Hora da Estrela", "Clarice Lispector", "Conjunto das Letrinhas", "Romance", 1977),
    ]

    // Exemplares
    const exemplares: Exemplar[] = [
        new Exemplar(1001, livros[0]!), // cópia de "Dom Casmurro"
        new Exemplar(1002, livros[1]!), // cópia de "O Hobbit"
        new Exemplar(1003, livros[2]!), // cópia de "A Moreninha"
        new Exemplar(1004, livros[3]!), // cópia de "Capitães da Areia"
        new Exemplar(1005, livros[4]!), // cópia de "A Hora da Estrela"
    ]

    exemplares.forEach(u => {
        exemplarMap.set(String(u.id), u)
    })

    const ger1 = new GerenciadorEmprestimos(usuariosMap, exemplarMap)


    // Teste 1
    console.log("----* Emprestimo *----")

    const usertest1 = usuariosMap.get("4")
    if (!usertest1) throw new Error("Usuário não encontrado")

    const exemptest1 = exemplarMap.get("1004")
    if (!exemptest1) throw new Error("Exemplar não encontrado")

    const emp1 = new Emprestimo(usertest1,exemptest1)
    const dtInicio1 = new Date("2025-09-01")
    const dtFim1 = new Date("2025-09-22")

    ger1.inicioEmprestimo(usertest1, exemptest1, emp1, dtInicio1)

    console.log("----* Devolução *----")
    ger1.concluiEmprestimo(usertest1, exemptest1, emp1, dtFim1)

}

main();