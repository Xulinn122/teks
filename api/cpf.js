export default async function handler(req, res) {
  try {
    const { cpf } = req.query;

    if (!cpf)
      return res.status(400).json({ erro: "Parâmetro 'cpf' é obrigatório." });

    const apiURL = `https://mdzapis.com/api/newss2/cpf/${cpf}?apikey=Nekro`;

    const response = await fetch(apiURL);
    const data = await response.json();

    // Quando a MDZ falha, ela pode retornar algo estranho
    if (!data || !data.CPF) {
      return res.status(404).json({ erro: "Nenhum resultado encontrado." });
    }

    // --- tradução / reorganização ---
    const resultado = {
      nome: data.nome_completo || data.NOME,
      cpf: data.CPF,
      nascimento: data.DT_NASCIMENTO,
      mae: data.NOME_MAE,
      sexo: traduzSexo(data.SEXO),
      status_receita: traduzStatus(data.STATUS_RECEITA_FEDERAL),
      obito: data.FLAG_OBITO === "1",
      data_obito: data.DT_OBITO || null,

      endereco: {
        tipo: data.TIPO_ENDERECO,
        logradouro: data.LOGRADOURO,
        numero: data.NUMERO,
        complemento: data.COMPLEMENTO,
        bairro: data.BAIRRO,
        cidade: data.CIDADE,
        estado: data.ESTADO,
        uf: data.UF,
        cep: data.CEP
      },

      renda: {
        renda_presumida: data.RENDA_PRESUMIDA || null,
        faixa_renda: data.FAIXA_RENDA || null
      },

      veiculos: {
        quantidade: data.QT_VEICULOS,
        lista: extrairVeiculos(data)
      },

      email: data.EMAIL || null,
      telefones: data.telefones || []
    };

    return res.status(200).json({
      sucesso: true,
      fonte: "Xuslin",
      resultado
    });

  } catch (err) {
    console.error("Erro na API CPF:", err);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
}

// --- helpers --- //

function traduzSexo(s) {
  return s === "M" ? "Masculino" : s === "F" ? "Feminino" : "Não informado";
}

function traduzStatus(s) {
  const map = {
    REGULAR: "Regular",
    CANCELADO: "Cancelado",
    NULO: "Nulo",
    SUSPENSO: "Suspenso",
    PENDENTE: "Pendente"
  };
  return map[s] || s;
}

function extrairVeiculos(data) {
  const lista = [];
  for (let i = 1; i <= 5; i++) {
    const marca = data[`MARCA_VEICULO${i}`];
    const modelo = data[`MODELO_VEICULO${i}`];
    const ano = data[`ANO_VEICULO${i}`];

    if (marca || modelo || ano) {
      lista.push({
        marca: marca || null,
        modelo: modelo || null,
        ano: ano || null
      });
    }
  }
  return lista;
}
