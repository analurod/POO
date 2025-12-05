// Interface de comportamento
interface GatewayPagamento {
  pagar(valor: number): void;
}

// Implementações dos gateways
class Stripe implements GatewayPagamento {
  pagar(valor: number) {
    console.log(`Pagamento de R$${valor} realizado via Stripe 💳`);
  }
}

class PayPal implements GatewayPagamento {
  pagar(valor: number) {
    console.log(`Pagamento de R$${valor} realizado via PayPal 🅿️`);
  }
}

class Pix implements GatewayPagamento {
  pagar(valor: number) {
    console.log(`Pagamento de R$${valor} realizado via PIX 🔢`);
  }
}

// Serviço que usa qualquer gateway
class ServicoPagamento {
  constructor(private gateway: GatewayPagamento) {}

  realizarPagamento(valor: number) {
    this.gateway.pagar(valor);
  }
}

// Testes
const servico1 = new ServicoPagamento(new Stripe());
servico1.realizarPagamento(120);

const servico2 = new ServicoPagamento(new PayPal());
servico2.realizarPagamento(89.90);

const servico3 = new ServicoPagamento(new Pix());
servico3.realizarPagamento(55.00);
