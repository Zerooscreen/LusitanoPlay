const TMDB_API_KEY = process.env.TMDB_API_KEY || '513182919ede525d4b5c8292e15b3c06';
const BASE_URL = 'https://api.themoviedb.org/3';

async function tmdb(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  url.searchParams.append('language', 'pt-BR'); // Mengatur bahasa ke Portugis (Brasil)
  
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`TMDB error: ${res.status}`);
  }
  return res.json();
}

function img(path, size = 'w500') {
  if (!path) return 'https://via.placeholder.com/500x750?text=Sem+Imagem';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

function slugify(str) {
  if (!str) return '';
  return str
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

module.exports = { tmdb, img, slugify };
