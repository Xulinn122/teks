export default async function handler(req, res) {
  try {
    const { nome } = req.query;

    if (!nome) {
      return res.status(400).json({ erro: "Parâmetro 'nome' é obrigatório." });
    }

    const apiURL = `http://br1.bronxyshost.com:4170/vip/consultas/nome?apitoken=Nicolas&query=${encodeURIComponent(nome)}`;

    const resposta = await fetch(apiURL);
    const dados = await resposta.json();

    // Validação de resposta vazia / sem resultado
    if (!dados || !Array.isArray(dados.resultado) || dados.resultado.length === 0) {
      return res.status(404).json({ erro: "Nenhum resultado encontrado." });
    }

    // --- MAPEAR OS RESULTADOS SEM SIGNO ---
    const resultadoLimpo = dados.resultado.map((item) => ({
      cpf: item.cpf,
      nome: item.nome,
      sexo: traduzSexo(item.sexo),
      nascimento: item.nascimento,
      idade: item.idade
      // NÃO incluir "signo"
    }));

    return res.status(200).json({
      sucesso: true,
      fonte: "Bronxy (via proxy FVV API)",
      total: resultadoLimpo.length,
      resultados: resultadoLimpo
    });

  } catch (error) {
    console.error("Erro na API Nome:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
}

// Helpers
function traduzSexo(sexo) {
  if (!sexo) return "Não informado";

  // Formatos comuns na Bronxy:
  // "M - Masculino"
  // "F - Feminino"
  const s = sexo.toUpperCase();

  if (s.startsWith("M")) return "Masculino";
  if (s.startsWith("F")) return "Feminino";

  return sexo;
}
