export const buscarFilme = async (query) => {
  const response = await fetch(
    `/api/search?query=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar filmes");
  }

  return await response.json();
};
