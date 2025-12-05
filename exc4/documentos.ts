abstract class Documento {
  
  // Template Method
  executar() {
    this.abrir();
    this.processar();
    this.salvar();
    this.fechar();
  }

  abrir() {
    console.log("Abrindo documento...");
  }

  salvar() {
    console.log("Salvando documento...");
  }

  fechar() {
    console.log("Fechando documento...");
  }

  abstract processar(): void;
}

class PDF extends Documento {
  processar() {
    console.log("Processando PDF 📄");
  }
}

class Word extends Documento {
  processar() {
    console.log("Processando documento Word 📝");
  }
}

// Teste
const d1 = new PDF();
d1.executar();

console.log("-----");

const d2 = new Word();
d2.executar();
