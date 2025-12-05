export class Tarefa {
  constructor(
    public id: number | null,
    public titulo: string,
    public descricao: string | null,
    public status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' = 'PENDENTE',
    public dataLimite: Date | null = null,
    public usuarioId: number
  ) {}

    iniciar() { 
        this.status = 'EM_ANDAMENTO' 
    }
  
    concluir() { 
        this.status = 'CONCLUIDA' 
    }
    
    reagendar(data: Date | null) { 
        this.dataLimite = data 
    }
}