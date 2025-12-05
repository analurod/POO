abstract class Transporte {
  constructor(public nome: string) {}

  abstract move(): void; // método polimórfico
}

// Transportes específicos
class Carro extends Transporte {
  move() {
    console.log(`${this.nome} está rodando na estrada 🚗`);
  }
}

class Aviao extends Transporte {
  move() {
    console.log(`${this.nome} está voando nos céus ✈️`);
  }
}

class Barco extends Transporte {
  move() {
    console.log(`${this.nome} está navegando no mar 🚤`);
  }
}

// Teste
const t1 = new Carro("Fusca");
const t2 = new Aviao("E2");
const t3 = new Barco("Lancha XP");

t1.move();
t2.move();
t3.move();
