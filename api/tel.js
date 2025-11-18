// api/tel.js
export default async function handler(req, res) {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        status: false,
        message: "Informe o telefone na query. Exemplo: ?query=73999197974"
      });
    }

    const url = `http://br1.bronxyshost.com:4170/vip/consultas/tel?apitoken=Nicolas&query=${query}`;

    const response = await fetch(url);
    const data = await response.json();

    // Caso a API externa retorne sem resultado
    if (!data || data.status !== true || !data.resultado) {
      return res.status(404).json({
        status: false,
        message: "Nenhum resultado encontrado."
      });
    }

    const r = data.resultado;

    // Organizar resposta final
    const pessoa = {
      nome: r.nome || "N/A",
      cpf: r.cpf_cnpj || "N/A",
      endereco: {
        logradouro: r.endereco?.logradouro || "N/A",
        numero: r.endereco?.numero || "N/A",
        complemento: r.endereco?.complemento || "N/A",
        bairro: r.endereco?.bairro || "N/A",
        cidade: r.endereco?.cidade || "N/A",
        estado: r.endereco?.estado || "N/A",
        cep: r.endereco?.cep || "N/A"
      }
    };

    return res.status(200).json({
      status: true,
      telefone: query,
      fonte: "Xuslin",
      resultado: pessoa
    });

  } catch (e) {
    return res.status(500).json({
      status: false,
      message: "Erro interno.",
      error: e.message
    });
  }
}
