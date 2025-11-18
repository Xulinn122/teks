export default async function handler(req, res) {
  try {
    const { nome } = req.query;

    if (!nome)
      return res.status(400).json({ erro: "Parâmetro 'nome' é obrigatório." });

    // --- 1. Buscar na API original ---
    const apiURL = `https://mdzapis.com/api/newss2/nome/${encodeURIComponent(nome)}?apikey=Nekro`;

    const resposta = await fetch(apiURL);
    const dados = await resposta.json();

if (!Array.isArray(dados.items) || dados.items.length < 1) {
  return res.status(404).json({ erro: "Nenhum resultado encontrado (items vazio)." });
}

    const item = dados.items[0];

    // --- 2. Traduzir / reorganizar ---
    const traduzido = {
      nome: item.name,
      cpf: item.document,
      rg: item.rg,
      data_nascimento: item.birthday,
      idade: item.age,
      signo: item.zodiac,
      mae: item.motherName,
      pai: item.fatherName,
      genero: item.genderType === "Female" ? "Feminino" : "Masculino",
      telefone_principal: {
        numero: item.mainPhone.number,
        whatsapp: item.mainPhone.isWhatsApp,
        rua: item.mainPhone.address,
        numero: item.mainPhone.addressNumber,
        bairro: item.mainPhone.neighborhood,
        cep: item.mainPhone.zipCode,
        cidade: item.mainPhone.city,
        estado: item.mainPhone.regionAbreviation
      },
      totais: {
        enderecos: item.totalAddress,
        emails: item.totalEmails,
        associados: item.totalBusinessAssociate,
        veiculos: item.totalVehicle,
        telefones: item.totalPhone,
        outros_contatos: item.totalOthersContact
      }
    };

    // --- 3. Retornar na sua API ---
    return res.status(200).json({
      sucesso: true,
      fonte: "Xuslin",
      resultado: traduzido
    });

  } catch (e) {
    console.error("Erro na API:", e);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
}
