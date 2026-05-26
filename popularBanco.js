const URL_API = 'http://localhost:3000/api/InsereLogs';

const QUANTIDADE_LOGS = 1000000;

const tiposPrograma = ['Ema_ERP', 'Ema_PDV', 'Ema_Servidor_8080', 'Ema_MotorERP', 'Ema_MotorDOX', 'Ema_Balcao', 'Ema_APS'];
const tiposLog = ['INFO', 'ERRO', 'DEBUG'];
const observacoes = [
  'Abrindo sistema', 
  'Erro ao conectar no banco de dados', 
  'Processando pagamento do cliente', 
  'Falha na emissão da NF-e',
  'Rotina de backup finalizada',
  'Timeout na integração com E-commerce'
];

const sortear = (array) => array[Math.floor(Math.random() * array.length)];

async function iniciarPopulacao() {
  console.log(`🚀 Iniciando o disparo de ${QUANTIDADE_LOGS} logs para ${URL_API}...`);
  console.log('--------------------------------------------------');

  for (let i = 1; i <= QUANTIDADE_LOGS; i++) {
    const payload = {
      Datahora: new Date().toLocaleString('pt-BR'),
      Tipo: Math.floor(Math.random() * 5) + 1,
      TipoPrograma: sortear(tiposPrograma),
      Porta: Math.floor(Math.random() * 1000) + 8000,
      Conteudo: {
        Observacao: sortear(observacoes),
        Descricao: "Log gerado automaticamente via script de Seed",
        Origem: Math.floor(Math.random() * 3) + 1,
        IdIntegracaoEcommerce: Math.floor(Math.random() * 100)
      },
      TipoLog: sortear(tiposLog)
    };

    try {
      // Faz a requisição POST para o seu microserviço
      const resposta = await fetch(URL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        console.log(`[${i}/${QUANTIDADE_LOGS}] Log indexado! ID: ${dados.id} | Tipo: ${payload.TipoLog}`);
      } else {
        console.error(`[${i}/${QUANTIDADE_LOGS}] Falha na API. Status: ${resposta.status}`);
      }
    } catch (erro) {
      console.error(`[${i}/${QUANTIDADE_LOGS}] Erro ao conectar na API: ${erro.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 50));
  }

  console.log('--------------------------------------------------');
  console.log('População do banco finalizada com sucesso! Abra o Kibana para conferir.');
}

// Executa o script
iniciarPopulacao();