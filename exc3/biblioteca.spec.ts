import { describe, it } from 'node:test'
import assert from 'node:assert'
import { addDays } from 'date-fns'

import { Biblioteca } from './biblioteca'
import { Emprestimo } from './emprestimo'
import { Exemplar } from './exemplar'
import { Livro } from './livro'
import { Usuario } from './usuario'

function setupBasico() {
  const usuariosMap = new Map<string, Usuario>()
  const exemplaresMap = new Map<string, Exemplar>()

  const usuario = new Usuario(1, 'José')
  usuariosMap.set(String(usuario.id), usuario)

  const livro = new Livro('Crime e Castigo', 'Fiódor Dostoiévski', 'Moderna', 'Romance', 1866)
  const exemplar = new Exemplar(1001, livro) // status padrão: 'Disponível'
  exemplaresMap.set(String(exemplar.id), exemplar)

  const bib = new Biblioteca(usuariosMap, exemplaresMap, [], [], [])

  console.log("\n SETUP BÁSICO CRIADO:")
  console.log("Usuário:", usuario)
  console.log("Exemplar:", exemplar)

  return { bib, usuario, exemplar }
}

describe('Novas regras', () => {
  it('Devolver com 5 dias de atraso → usuário fica bloqueado por 5 dias', () => {
    const { bib, usuario, exemplar } = setupBasico()

    const emprestimo = new Emprestimo(usuario, exemplar)
    const dtInicio = new Date('2025-09-01T00:00:00Z')
    const dtDevolucaoComAtraso5 = addDays(dtInicio, 14 + 5)

    console.log("\n INICIANDO EMPRÉSTIMO:")
    console.log("Data início:", dtInicio)

    bib.inicioEmprestimo(usuario, exemplar, emprestimo, dtInicio)

    console.log("\n DEVOLUÇÃO COM ATRASO:")
    console.log("Data devolução:", dtDevolucaoComAtraso5)

    bib.concluiEmprestimo(usuario, exemplar, emprestimo, dtDevolucaoComAtraso5)

    console.log("\n STATUS DO USUÁRIO APÓS DEVOLUÇÃO:")
    console.log("Bloqueado:", usuario.bloqueado)
    console.log("Dias bloqueado:", usuario.diasBloqueado)
    console.log("Início punição:", usuario.inicioPunicao)
    console.log("Fim punição:", usuario.fimPunicao)

    assert.equal(usuario.bloqueado, true)
    assert.equal(usuario.diasBloqueado, 5)
  })

  it('Usuário bloqueado tentar emprestar → erro', () => {
    const { bib, usuario, exemplar } = setupBasico()

    // Simulando 3 dias de atraso
    usuario.bloqueado = true
    usuario.diasBloqueado = 3
    usuario.inicioPunicao = new Date()
    usuario.fimPunicao = addDays(new Date(), 3)

    console.log("\n USUÁRIO BLOQUEADO TENTANDO EMPRESTAR:")
    console.log(usuario)

    const novoEmprestimo = new Emprestimo(usuario, exemplar)

    assert.throws(
      () => bib.inicioEmprestimo(usuario, exemplar, novoEmprestimo, new Date()),
      /Usuário está bloqueado até/
    )
  })

  it('Exemplar danificado → não pode mais emprestar', () => {
    const { bib, usuario, exemplar } = setupBasico()

    const emprestimo = new Emprestimo(usuario, exemplar)
    const dtInicio = new Date('2025-09-01T00:00:00Z')
    const dtDevolucao = new Date('2025-09-10T00:00:00Z')

    console.log("\n EMPRÉSTIMO NORMAL:")
    bib.inicioEmprestimo(usuario, exemplar, emprestimo, dtInicio)

    console.log("\n DEVOLUÇÃO DANIFICADA:")
    bib.registrarDevolucaoDanificada(usuario, exemplar, emprestimo, dtDevolucao)

    console.log("\n EXEMPLAR APÓS DANO:")
    console.log("Status:", exemplar.status)

    assert.equal(exemplar.status, 'Danificado')

    const outroEmprestimo = new Emprestimo(usuario, exemplar)
    assert.throws(
      () => bib.inicioEmprestimo(usuario, exemplar, outroEmprestimo, addDays(dtDevolucao, 1)),
      /Exemplar não disponível para emprestimo! Status: Danificado/
    )
  })
})
