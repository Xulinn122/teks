export default async function handler(req, res) {
  try {
    let nome = req.query.query;

    if (!nome) {
      return res.status(400).json({
        status: false,
        erro: "Informe o nome da mãe em ?query="
      });
    }

    // limpar espaços extras
    nome = nome.trim();

    const url = `http://br1.bronxyshost.com:4170/vip/consultas/mae?apitoken=Nicolas&query=${encodeURIComponent(nome)}`;

    const r = await fetch(url);
    const json = await r.json();

    if (!json.status) {
      return res.status(404).json({
        status: false,
        erro: "Nenhum resultado encontrado"
      });
    }

    return res.status(200).json({
      status: true,
      fonte: "Xuslin",
      mae: json?.resultado?.mae || null,
      filhos: json?.resultado?.filhos || []
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      erro: err.toString()
    });
  }
}
