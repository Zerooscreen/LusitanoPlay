const { img, slugify } = require('./tmdb');

const SITE_NAME = 'FilmoraBG';
const DEFAULT_TITLE = 'FilmoraBG – Гледай Филми Онлайн с БГ Субтитри и Аудио';
const DEFAULT_DESC = 'Открий нови филми и популярни сериали с български субтитри и аудио. Разгледай трейлъри, резюмета, актьорски състав и информация за най-новите заглавия.';
const DEFAULT_OG_IMAGE = 'https://placehold.co/1200x630/17171b/8d8a92?text=FilmoraBG';
const WATCH_REDIRECT_URL = 'https://moviegate.bolt.host/bg';
const GOOGLE_SITE_VERIFICATION = 'M-_SCpf4h0A8JcaYgk3_kEfeagIFV6cKmqsg0iROtiI';

function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function watchButton() {
  return `
    <div style="margin: 20px 0;">
      <a href="${WATCH_REDIRECT_URL}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
        <button class="btn-trailer" style="background-color: var(--accent); color: white; padding: 14px 28px; border: none; font-size: 16px; cursor: pointer; border-radius: 8px; font-weight: bold; width: 100%; max-width: 250px; text-transform: uppercase; transition: background 0.2s;">
          Гледай сега
        </button>
      </a>
    </div>
  `;
}

function head({ title, description, url, image, type = 'website', robots = 'index, follow' }) {
  const t = escapeHtml(title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE);
  const d = escapeHtml((description || DEFAULT_DESC).slice(0, 160));
  const ogImg = image || DEFAULT_OG_IMAGE;
  return `
    <title>${t}</title>
    <meta name="google-site-verification" content="${GOOGLE_SITE_VERIFICATION}" />
    <meta name="description" content="${d}">
    <meta name="robots" content="${robots}">
    <link rel="canonical" href="${url}">
    <meta property="og:type" content="${type}">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta property="og:title" content="${t}">
    <meta property="og:description" content="${d}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${ogImg}">
    <meta property="og:locale" content="bg_BG">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${t}">
    <meta name="twitter:description" content="${d}">
    <meta name="twitter:image" content="${ogImg}">

    <!-- ADSTERRA POPUNDER SCRIPT -->
    <script data-cfasync="false" src="https://aarems.org/1/5165ed7649b06fc95e9d3bbc1839dcd9"></script>
  `;
}

function movieJsonLd(data, url) {
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: data.title,
    description: (data.overview || '').slice(0, 300),
    url,
    image: img(data.poster_path || data.backdrop_path, 'w780'),
    datePublished: data.release_date || undefined,
    genre: (data.genres || []).map(g => g.name),
  };
  if (data.vote_average && data.vote_count) {
    payload.aggregateRating = { '@type': 'AggregateRating', ratingValue: data.vote_average.toFixed(1), ratingCount: data.vote_count, bestRating: '10', worstRating: '0' };
  }
  return `<script type="application/ld+json">${JSON.stringify(payload)}</script>`;
}

function tvJsonLd(data, url) {
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: data.name,
    description: (data.overview || '').slice(0, 300),
    url,
    image: img(data.poster_path || data.backdrop_path, 'w780'),
    datePublished: data.first_air_date || undefined,
    genre: (data.genres || []).map(g => g.name),
    numberOfSeasons: data.number_of_seasons || undefined,
    numberOfEpisodes: data.number_of_episodes || undefined,
  };
  if (data.vote_average && data.vote_count) {
    payload.aggregateRating = { '@type': 'AggregateRating', ratingValue: data.vote_average.toFixed(1), ratingCount: data.vote_count, bestRating: '10', worstRating: '0' };
  }
  return `<script type="application/ld+json">${JSON.stringify(payload)}</script>`;
}

function bannerScript(key, width, height) {
  return `<script>atOptions = { 'key' : '${key}', 'format' : 'iframe', 'height' : ${height}, 'width' : ${width}, 'params' : {} };</script><script src="https://bancadeltempoidea.org/22/${key}"></script>`;
}

function topBannerAd() {
  return `<div class="ad-slot ad-desktop-only">${bannerScript('9eab15e2d0d97de74e3ee971fe615a5e', 728, 90)}</div><div class="ad-slot ad-mobile-only">${bannerScript('374f3cbadfdea331b749dcfc79f79f2c', 320, 50)}</div>`;
}

function sideBannerAd() { 
  return `<div class="ad-slot ad-desktop-only">${bannerScript('25247fde261d8f76e06b91b9d74945f4', 160, 600)}</div>`; 
}

function banner300x250Ad() {
  return `<div class="ad-slot">${bannerScript('619e9f7dadd08146f364afc8090e514c', 300, 250)}</div>`;
}

function banner468x60Ad() {
  return `<div class="ad-slot">${bannerScript('b4c5edd71dd22f2f3a51a8206816e9ac', 468, 60)}</div>`;
}

function nativeBannerAd() {
  return `<div class="ad-slot ad-native"><script async="async" data-cfasync="false" src="https://bancadeltempoidea.org/21/6f7b03feb080b4884047d6210ed8268e"></script><div id="container-6f7b03feb080b4884047d6210ed8268e"></div></div>`;
}

function socialBarScript() { 
  return `<script data-cfasync="false" src="https://bancadeltempoidea.org/14/afc16d8a70f1f493abf2098939fca8f7"></script>`; 
}

function histatsSnippet() {
  return `
    <div id="histats_counter" style="display:none;"></div>
    <script type="text/javascript">
    var _Hasync = _Hasync || [];
    _Hasync.push(['Histats.start', '1,5014113,4,1,120,40,00011111']);
    _Hasync.push(['Histats.fasi', '1']);
    _Hasync.push(['Histats.track_hits', '']);
    (function() {
      var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
      hs.src = ('//s10.histats.com/js15_as.js');
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
    })();
    </script>
  `;
}

function layout({ headHtml, bodyHtml, activeTab = 'movie' }) {
  return `<!DOCTYPE html>
<html lang="bg">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${headHtml}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css">
<style>.ad-slot { display: flex; justify-content: center; align-items: center; margin: 20px auto; overflow: hidden; } .ad-mobile-only { display: none; } @media (max-width: 768px) { .ad-desktop-only { display: none; } .ad-mobile-only { display: flex; } }</style>
</head>
<body>
<header><div class="header-inner"><a class="logo" href="/movie">Filmora<span>BG</span></a><nav class="tabs"><a class="tab-btn ${activeTab === 'movie' ? 'active' : ''}" href="/movie">Филми</a><a class="tab-btn ${activeTab === 'tv' ? 'active' : ''}" href="/tv">Сериали</a></nav><div class="search-wrap"><input id="search-input" type="text" placeholder="Търсене на заглавие..." autocomplete="off"><div class="search-results" id="search-results"></div></div></div></header>
${topBannerAd()}
<main>${bodyHtml}</main>
<footer><p>FilmoraBG — сайт с информация за филми и сериали, базиран на публични данни от TMDB · Powered by <a href="https://www.themoviedb.org/" target="_blank" rel="noopener">TMDB</a></p>${histatsSnippet()}</footer>
<script src="/app.js"></script>${socialBarScript()}
</body>
</html>`;
}

function posterCard(item, type) {
  const title = item.title || item.name;
  const date = (item.release_date || item.first_air_date || '').slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : '-';
  const slug = slugify(title);
  return `<a class="poster-card" href="/${type}/${item.id}/${encodeURIComponent(slug)}"><div class="poster-frame"><img src="${img(item.poster_path)}" alt="${escapeHtml(title)}" loading="lazy"><div class="poster-badge">★ ${rating}</div></div><div class="poster-title">${escapeHtml(title)}</div><div class="poster-sub">${date || 'Неизвестна година'}</div></a>`;
}

function genreRow(genres) {
  if (!genres || !genres.length) return '';
  return `<div class="genre-row">${genres.map(g => `<span class="genre-pill">${escapeHtml(g.name)}</span>`).join('')}</div>`;
}

function trailerBlock(videos) {
  const list = (videos && videos.results) || [];
  const trailer = list.find(v => v.site === 'YouTube' && v.type === 'Trailer') || list.find(v => v.site === 'YouTube');
  if (!trailer) return `<div class="no-trailer" style="color: var(--text-muted); padding: 10px 0;">Няма наличен трейлър.</div>`;
  return `<div class="trailer-wrap"><iframe src="https://www.youtube.com/embed/${trailer.key}" title="trailer" allowfullscreen loading="lazy"></iframe></div>`;
}

function castGrid(credits) {
  const cast = ((credits && credits.cast) || []).slice(0, 12);
  if (!cast.length) return `<div class="empty" style="color: var(--text-muted);">Няма налична информация за актьорския състав.</div>`;
  return `<div class="cast-grid">${cast.map(c => `
    <a href="/search?q=${encodeURIComponent(c.name)}" class="cast-card" style="text-decoration: none; color: inherit; display: block;">
      <img src="${img(c.profile_path, 'w185')}" alt="${escapeHtml(c.name)}" loading="lazy">
      <div class="cast-name">${escapeHtml(c.name)}</div>
      <div class="cast-role">${escapeHtml(c.character || '')}</div>
    </a>
  `).join('')}</div>`;
}

function similarSection(similar) {
  const list = (similar && similar.results) || [];
  if (list.length === 0) return '';
  return `<div class="section-block"><h3>Подобни филми</h3><div class="grid">${list.slice(0, 6).map(item => posterCard(item, item.media_type || 'movie')).join('')}</div></div>`;
}

module.exports = { 
  head, 
  layout, 
  posterCard, 
  genreRow, 
  trailerBlock, 
  castGrid, 
  similarSection, 
  watchButton, 
  escapeHtml, 
  movieJsonLd, 
  tvJsonLd, 
  sideBannerAd, 
  nativeBannerAd, 
  banner300x250Ad,
  banner468x60Ad,
  DEFAULT_TITLE, 
  DEFAULT_DESC, 
  SITE_NAME 
};
