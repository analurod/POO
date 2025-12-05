import { addDays, format } from 'date-fns'
import { Usuario } from "./usuario"
import { Exemplar } from "./exemplar"
import { Livro } from "./livro"
import { Emprestimo } from "./emprestimo"

export class Biblioteca{
    constructor(
        public usuarios: Map<string, Usuario>,
        public exemplares: Map<string, Exemplar>,
        public emprestimosrealizados: Emprestimo[],
        public exemplardanificado: Exemplar[],
        public punicoes: Usuario[],
    ){}

    inicioEmprestimo(usuario: Usuario, exemplar: Exemplar, emprestimo: Emprestimo, em: Date): void{
        if(exemplar.status !== 'Disponível' ){
            throw Error(`Exemplar não disponível para emprestimo! Status: ${exemplar.status}`)
        }
        if(emprestimo.estado != 'Rascunho'){
            throw Error(`Emprestimo já iniciado! Status: ${emprestimo.estado}`)
        }
        if(this.estaBloqueado(usuario, em)){
            const dp: Date = usuario.fimPunicao!
            throw Error(`Usuário está bloqueado até ${format(dp, 'dd/MM/yy')}`)
        }

        const emprestimosAtivosDoUsuario = this.emprestimosrealizados.filter(
            e => e.estado === 'Ativo' && e.usuario === usuario
        ) 
        if (emprestimosAtivosDoUsuario.length >= 3) {
            throw new Error('Usuário excedeu o número de empréstimos')
        }
        
        emprestimo.inicio = em
        exemplar.status = 'Emprestado'
        emprestimo.estado = 'Ativo'
        this.emprestimosrealizados.push(emprestimo) // Histórico de Emprestimos

        emprestimo.dataDevida = addDays(emprestimo.inicio, 14)

        console.log(`Emprestimo: ${emprestimo.estado} em ${format(em, 'dd/MM/yy')}:
           Usuário: ${usuario.nome}
           Exemplar: ${exemplar.livro.titulo}
        `)
    }

    concluiEmprestimo(usuario: Usuario, exemplar: Exemplar, emprestimo: Emprestimo, em: Date): void{
        if(emprestimo.estado != 'Ativo'){
            throw Error(`Emprestimo não está ativo! Status: ${emprestimo.estado}`)
        }

        emprestimo.fim = em
        exemplar.status = 'Disponível'
        emprestimo.estado = 'Concluido'

        const atraso = emprestimo.diasAtraso(em)
        usuario.diasBloqueado = atraso

        if(atraso != 0){
            this.bloquearUsuario(usuario, atraso, em)
        }

        console.log(`Emprestimo: ${emprestimo.estado} em ${format(em, 'dd/MM/yy')}:
           Usuário: ${usuario.nome}
           Exemplar: ${exemplar.livro.titulo}
           Dias em Atraso: ${atraso}
        `)
    }

    bloquearUsuario(usuario: Usuario, atraso: number, inicio: Date): void{
        usuario.bloqueado = true
        usuario.inicioPunicao = inicio
        usuario.calculaDiaVolta(atraso, inicio)
        this.punicoes.push(usuario)
    }

    desbloquearUsuario(usuario: Usuario, hoje: Date): void{
        if(!usuario.fimPunicao){
            throw Error(`O usuário ${usuario.id} - ${usuario.nome} não está bloqueado!`)
        }
        if(hoje < usuario.fimPunicao){
            const dp: Date = usuario.fimPunicao
            throw Error(`Ainda não é possível desbloquear o usuário ${usuario.id} - ${usuario.nome}! Fim da punição em: ${format(dp, 'dd/MM/yy')}`)
        }

        usuario.bloqueado = false
        usuario.inicioPunicao = null
        usuario.fimPunicao = null
        console.log(`O usuário ${usuario.id} - ${usuario.nome} foi desbloqueado!`)
    }

    estaBloqueado(usuario: Usuario, em: Date){
        const hoje: Date= new Date()
        if (!usuario.fimPunicao || usuario.fimPunicao < hoje){
            return false
        }
        if(hoje <= usuario.fimPunicao){
            return true
        }
    }

    registrarDevolucaoDanificada(usuario: Usuario, exemplar: Exemplar, emprestimo: Emprestimo, em: Date): void{
        if(emprestimo.estado != 'Ativo'){
            throw Error(`Emprestimo não está ativo! Status: ${emprestimo.estado}`)
        }

        emprestimo.fim = em
        exemplar.status = 'Danificado'
        this.exemplardanificado.push(exemplar)


        emprestimo.estado = 'Concluido'
        const atraso = emprestimo.diasAtraso(em)
        usuario.diasBloqueado = atraso

        if(atraso != 0){
            this.bloquearUsuario(usuario, atraso, em)
        }
        
        console.log(`Emprestimo: ${emprestimo.estado} em ${format(em, 'dd/MM/yy')}:
           Usuário: ${usuario.nome}
           Exemplar: ${exemplar.livro.titulo}
           Dias em Atraso: ${atraso}
        `)
    }

    listarHistoricoDanificados():void{
        if(this.exemplardanificado.length === 0){
            console.log("Nenhum exemplar danificado no histórico.")
            return
        }

        console.log("Histórico de exemplares danificados:")
        this.exemplardanificado.forEach(e => console.log(`${e.id} - ${e.livro.titulo}`))
    }

    listarHistoricoPunicoes():void{
        if(this.punicoes.length === 0){
            console.log("Nenhum usuário punido por atraso no histórico.")
        return
        }

        console.log("Histórico de usuários punidos por atraso:")
        this.punicoes.forEach(e => {
            const fp: Date = e.fimPunicao!
            const ip: Date = e.inicioPunicao!
            console.log(`${e.id} - ${e.nome}: DE: ${format(ip, 'dd/MM/yy')} a ${format(fp, 'dd/MM/yy')}`)
        })
    }

    listarEmprestimos():void{
        if(this.emprestimosrealizados.length === 0){
            console.log("Nenhum emprestimo no histórico.")
        return
        }

        console.log("Histórico de emprestimos:")
        this.emprestimosrealizados.forEach(e =>{
            const fp: Date = e.fim!
            const ip: Date = e.inicio!
            console.log(`Saída: ${format(ip, 'dd/MM/yy')} - Retorno: ${format(fp, 'dd/MM/yy')}: Exemplar: ${e.exemplar.livro.titulo} - Usuário: ${e.usuario.id} - ${e.usuario.nome}`)
        })
            
    }

}