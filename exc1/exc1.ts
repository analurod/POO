class Estudante {
    nome: string
    notas: number[]

    constructor(nome: string, notas: number[]){
        this.nome = nome
        this.notas = notas
    }

    greet(): void{
        console.log(`ESTUDANTE: ${this.nome}`)

        for (const [index, nota] of this.notas.entries()) { // entries: pega índice e valor ao mesmo tempo
            console.log(`Nota ${index + 1}: ${nota}`);
        }
    }

    adicionarNota(notanova: number): void {
        this.notas.push(notanova);
        console.log(`NOTA ADICIONADA PARA ${this.nome}: ${notanova}\n`);
    }


    media(): number{
        let soma: number = this.notas.reduce((acc, n) => acc + n, 0) //reduce:  faz a soma acumulada dos elementos do array
        return soma / this.notas.length
    }
}

const estudantes: Estudante[] = [
    new Estudante("Ana Luisa", [10, 10, 9]),
    new Estudante("Bruna", [8, 7, 9]),
    new Estudante("Carlos", [1, 5, 7]),
    new Estudante("Otavio", [10, 8, 6])
]

// Percorrer o array de estudantes
for (const aluno of estudantes) {
    aluno.greet()
    console.log(`MÉDIA: ${aluno.media()}\n`)
}

// Adiciona nota para a Ana
estudantes[0]?.adicionarNota(10) // ? Verifica se não é nulo

// Adiciona nota para o Bruna
estudantes[1]?.adicionarNota(6)

// Adiciona nota para o Carlos
estudantes[2]?.adicionarNota(0)

// Adiciona nota para o Otavio
estudantes[3]?.adicionarNota(8.5)


for (const aluno of estudantes) {
    aluno.greet()
    console.log(`MÉDIA: ${aluno.media()}\n`)
}






