export default async function handler(req, res) {
  try {
    const { placa } = req.query;

    if (!placa)
      return res.status(400).json({ erro: "Parâmetro 'placa' é obrigatório." });

    // --- 1. Buscar na API MDZ ---
    const apiURL = `https://mdzapis.com/api/newss2/placa/${placa}?apikey=Nekro`;
    const resposta = await fetch(apiURL);
    const data = await resposta.json();

    if (!data || !data.dados) {
      return res.status(404).json({ erro: "Nenhum resultado encontrado." });
    }

    const v = data.dados;

    // --- 2. Traduzir / reorganizar ---
    const resultado = {
      placa: v.placa,
      chassi: v.chassi,
      renavam: v.codigoRenavam,
      situacao: traduzSituacao(v.situacao),
      municipio: v.descricaoMunicipioEmplacamento,
      uf: v.ufJurisdicao,
      modelo: v.descricaoMarcaModelo,
      tipo: v.descricaoTipoVeiculo,
      especie: v.descricaoEspecieVeiculo,
      cor: v.descricaoCor,
      categoria: v.descricaoCategoria,
      ano_modelo: v.anoModelo,
      ano_fabricacao: v.anoFabricacao,
      combustivel: v.descricaoCombustivel,
      potencia: v.potencia,
      cilindradas: v.cilindradas,
      proprietario: v.nomeProprietario || "Não informado",
      documento_proprietario: v.numeroIdentificacaoProprietario,
      restricoes: {
        roubo_furto: v.indicadorRouboFurto,
        renainf: v.descricaoRestricao2,
        renajud: v.descricaoRestricao3
      },
      debitos: v.debitos?.erro ? "Não disponível" : v.debitos,
      importado: v.procedencia !== "NACIONAL",
    };

    // --- 3. Resposta final da sua API ---
    return res.status(200).json({
      sucesso: true,
      fonte: "Xuslin",
      resultado
    });

  } catch (e) {
    console.error("Erro na API:", e);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
}

// Função simples de tradução de situação
function traduzSituacao(s) {
  const map = {
    EM_CIRCULACAO: "Em circulação",
    BAIXADO: "Baixado",
    ROUBO_FURTO: "Roubado/Furtado"
  };
  return map[s] || s;
}
