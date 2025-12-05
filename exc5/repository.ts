import { PrismaClient} from '@prisma/client'
import { Tarefa } from './tarefa'
import { Usuario } from './usuario'

const prisma = new PrismaClient()

export class UsuarioRepository {
  async criar(usuario: Usuario) {
    const created = await prisma.usuario.create({
      data: { nome: usuario.nome, email: usuario.email }
    })
    return created
  }

  async buscarPorId(id: number) {
    return prisma.usuario.findUnique({ where: { id } })
  }

  async buscarPorEmail(email: string) {
    return prisma.usuario.findUnique({ where: { email } })
  }
}

export class TarefaRepository {
  async criar(tarefa: Tarefa) {
    const created = await prisma.tarefa.create({
      data: {
        titulo: tarefa.titulo,
        descricao: tarefa.descricao ?? null,
        status: tarefa.status,
        dataLimite: tarefa.dataLimite ?? null,
        usuarioId: tarefa.usuarioId,
      }
    })
    return created
  }

  async listarPorUsuario(usuarioId: number) {
    return prisma.tarefa.findMany({
      where: { usuarioId },
      orderBy: [{ dataLimite: 'asc' }]
    })
  }

  async atualizarStatus(id: number, status: string) {
    return prisma.tarefa.update({ where: { id }, data: { status } })
  }

  async atualizarPrazo(id: number, dataLimite: Date | null) {
    return prisma.tarefa.update({ where: { id }, data: { dataLimite } })
  }

  async excluir(id: number) {
    return prisma.tarefa.delete({ where: { id } })
  }

  async excluirTodas() {
    return prisma.tarefa.deleteMany({});
  }

}

