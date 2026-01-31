import express from "express";

const router = express.Router();

router.get("/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query não informada" });
  }

  const apiKey = process.env.TMDB_KEY;
  if (!apiKey || apiKey === "sua_chave_aqui") {
    return res.status(500).json({ error: "Chave da API TMDB não configurada no servidor" });
  }

  try {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.status_message || "Erro na API TMDB" });
    }

    const data = await response.json();
    res.json(data.results || []);
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    res.status(500).json({ error: "Erro interno ao buscar filmes" });
  }
});

export default router;
