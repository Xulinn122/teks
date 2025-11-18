// api/cep.js
export default async function handler(req, res) {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        status: false,
        message: "Informe o CEP na query. Exemplo: ?query=67133000"
      });
    }

    const url = `http://br1.bronxyshost.com:4170/vip/consultas/cep?apitoken=Nicolas&query=${query}`;

    const response = await fetch(url);
    const data = await response.json();

    // Se a API externa retornar algo inválido
    if (!data || data.status !== true || !data.resultado) {
      return res.status(404).json({
        status: false,
        message: "Nenhum resultado encontrado."
      });
    }

    // --- FORMATAR DADOS ---
    const pessoas = Array.isArray(data.resultado.pessoas)
      ? data.resultado.pessoas.map(p => ({
          cpf: p.cpf || "N/A",
          nome: p.nome || "N/A",
          nascimento: p.nascimento || "N/A",
          email: p.email || "N/A",
          renda: p.renda || "N/A",
          bairro: p.bairro || "N/A",
          cidade: p.cidade || "N/A",
          uf: p.uf || "N/A",
          cep: p.cep || query
        }))
      : [];

    return res.status(200).json({
      status: true,
      cep: data.resultado.cep || query,
      fonte: "Xuslin",
      quantidade: pessoas.length,
      pessoas
    });

  } catch (e) {
    return res.status(500).json({
      status: false,
      message: "Erro interno.",
      error: e.message
    });
  }
}
