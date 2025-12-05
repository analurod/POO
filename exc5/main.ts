import { UsuarioRepository, TarefaRepository} from './repository'
import { Tarefa } from './tarefa'
import { Usuario } from './usuario'

const usuariosRepo = new UsuarioRepository();
const tarefasRepo  = new TarefaRepository();

// Função auxiliar: cria usuários de exemplo, se ainda não existirem
async function criarUsuariosExemplo() {
  const listaUsuarios = [
    new Usuario(null, 'Ana Lemos', 'ana@email.com'),
    new Usuario(null, 'Bruno Souza', 'bruno@email.com'),
    new Usuario(null, 'Carla Dias', 'carla@email.com'),
  ]

  const criados: any[] = []

  for (const u of listaUsuarios) {
    // Evita duplicar caso já exista
    const existente = await usuariosRepo.buscarPorEmail(u.email)
    if (existente) {
      criados.push(existente)
    } else {
      const novo = await usuariosRepo.criar(u)
      criados.push(novo)
    }
  }

  console.log('\n✅ Usuários disponíveis:')
  console.table(criados.map(u => ({ id: u.id, nome: u.nome, email: u.email })))

  return criados
}

// Função que cria 3 tarefas para cada usuário
async function criarTarefasParaUsuarios(usuarios: any[]) {
  const t1 = new Tarefa(null, `Estudar Prisma`, 'Modelar relações e migrar', 'PENDENTE', new Date(), 1)
  const t2 = new Tarefa(null, `Ler TypeScript Docs`, null, 'PENDENTE', null, 2)
  const t3 = new Tarefa(null, `Revisar código`, 'Aplicar padrão Repository', 'PENDENTE', null, 3)

  await tarefasRepo.criar(t1)
  await tarefasRepo.criar(t2)
  await tarefasRepo.criar(t3)
  
  console.log('\nTarefas criadas para cada usuário.')
}

// Função para listar todas as tarefas de todos os usuários
async function listarTarefasPorUsuario(usuarios: any[]) {
  for (const user of usuarios) {
    const lista = await tarefasRepo.listarPorUsuario(user.id)
    console.log(`\n📂 Tarefas de ${user.nome}:`)
    console.table(lista.map(t => ({
      id: t.id,
      titulo: t.titulo,
      status: t.status,
      dataLimite: t.dataLimite ? new Date(t.dataLimite).toLocaleDateString() : '-'
    })))
  }
}



// Execução principal
async function main() {
    const usuarios = await criarUsuariosExemplo()
    await criarTarefasParaUsuarios(usuarios)
    await listarTarefasPorUsuario(usuarios)
    
    await tarefasRepo.atualizarStatus(49, 'EM_ANDAMENTO')
    await tarefasRepo.atualizarStatus(50, 'EM_ANDAMENTO')
    await tarefasRepo.atualizarStatus(51, 'EM_ANDAMENTO')

    await tarefasRepo.atualizarPrazo(49, new Date(2025, 10, 26))
    await tarefasRepo.atualizarPrazo(50, new Date(2025, 9, 29))
    await tarefasRepo.atualizarPrazo(51, new Date(2025, 10, 22))

    await tarefasRepo.atualizarStatus(51, 'CONCLUIDA')

    await listarTarefasPorUsuario(usuarios)


}

main()