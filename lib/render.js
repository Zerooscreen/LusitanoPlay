const SITE_NAME = 'LusitanoPlay';
const DEFAULT_TITLE = 'LusitanoPlay – Filmes e Séries, Estreias de Cinema em 2026';
const DEFAULT_DESC = 'Descubra estreias de cinema, filmes internacionais e séries populares. Consulte sinopses, críticas, elenco e trailers, com informações atualizadas sobre o mundo do entretenimento.';

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function head({ title = DEFAULT_TITLE, description = DEFAULT_DESC, url = '', image = '', robots = 'index, follow', type = 'website' }) {
  return `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="${robots}">
    
    <!-- Google Search Console Verification -->
    <meta name="google-site-verification" content="M-_SCpf4h0A8JcaYgk3_kEfeagIFV6cKmqsg0iROtiI" />

    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    ${url ? `<meta property="og:url" content="${url}">` : ''}
    ${image ? `<meta property="og:image" content="${image}">` : ''}
    <meta property="og:type" content="${type}">
    <meta property="og:site_name" content="${SITE_NAME}">
    <link rel="stylesheet" href="/style.css">

    <!-- ADSTERRA POPUNDER & SOCIAL BAR -->
    <script data-cfasync="false" src="https://aarems.org/1/5165ed7649b06fc95e9d3bbc1839dcd9"></script>
    <script data-cfasync="false" src="https://bancadeltempoidea.org/14/afc16d8a70f1f493abf2098939fca8f7"></script>
  `;
}

function layout({ headHtml, bodyHtml, activeTab }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  ${headHtml}
</head>
<body>
  <!-- Histats Hidden Counter -->
  <div id="histats_counter" style="display:none;"></div>
  <script type="text/javascript">var _Hasync= _Hasync|| [];
  _Hasync.push(['Histats.start', '1,5014113,4,1,120,40,00011111']);
  _Hasync.push(['Histats.fasi', '1']);
  _Hasync.push(['Histats.track_hits', '']);
  (function() {
  var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
  hs.src = ('//s10.histats.com/js15_as.js');
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
  })();</script>
  <noscript><a href="/" target="_blank"><img src="//sstatic1.histats.com/0.gif?5014113&101" alt="" border="0"></a></noscript>

  <header id="header">
    <div class="header-content">
      <a href="/" class="logo">Lusitano<span>Play</a>
      <nav class="nav-links">
        <a href="/movie" class="${activeTab === 'movie' ? 'active' : ''}">Filmes</a>
        <a href="/tv" class="${activeTab === 'tv' ? 'active' : ''}">Séries</a>
      </nav>
      <div class="search-box">
        <input type="text" id="search-input" placeholder="Pesquisar filmes, séries..." autocomplete="off">
        <div id="search-results" class="search-dropdown"></div>
      </div>
    </div>
  </header>
  
  <!-- Banner 728x90 -->
  <div style="text-align:center; margin: 10px 0;">
    <script>
      atOptions = {
        'key' : '9eab15e2d0d97de74e3ee971fe615a5e',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    </script>
    <script src="https://bancadeltempoidea.org/22/9eab15e2d0d97de74e3ee971fe615a5e"></script>
  </div>

  <main id="main">
    ${bodyHtml}
  </main>

  <footer id="footer">
    <!-- Banner 468x60 -->
    <div style="text-align:center; margin: 15px 0;">
      <script>
        atOptions = {
          'key' : 'b4c5edd71dd22f2f3a51a8206816e9ac',
          'format' : 'iframe',
          'height' : 60,
          'width' : 468,
          'params' : {}
        };
      </script>
      <script src="https://bancadeltempoidea.org/22/b4c5edd71dd22f2f3a51a8206816e9ac"></script>
    </div>
    <p>&copy; ${new Date().getFullYear()} LusitanoPlay. Todos os direitos reservados.</p>
  </footer>

  <script src="/app.js"></script>
</body>
</html>`;
}

function posterCard(item, kind) {
  const title = item.title || item.name || '';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : '-';
  const posterPath = item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : 'https://via.placeholder.com/342x513?text=Sem+Imagem';
  const urlKind = kind === 'tv' ? 'tv' : 'movie';
  const slug = item.slug || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : 'item');

  return `
    <div class="poster-card" onclick="window.location.href='/${urlKind}/${item.id}/${encodeURIComponent(slug)}'">
      <div class="poster-img-wrap">
        <img src="${posterPath}" alt="${escapeHtml(title)}" loading="lazy">
        <div class="poster-rating">★ ${rating}</div>
      </div>
      <div class="poster-title">${escapeHtml(title)}</div>
      <div class="poster-year">${year}</div>
    </div>
  `;
}

function genreRow(genres) {
  if (!genres || !genres.length) return '';
  return `<div class="detail-genres">${genres.map(g => `<span class="genre-tag">${escapeHtml(g.name)}</span>`).join('')}</div>`;
}

function trailerBlock(videos) {
  if (!videos || !videos.results) return '<p>Trailer indisponível.</p>';
  const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  if (!trailer) return '<p>Trailer indisponível.</p>';
  return `
    <div class="video-container">
      <iframe src="https://www.youtube.com/embed/${trailer.key}" title="Trailer" frameborder="0" allowfullscreen></iframe>
    </div>
  `;
}

function castGrid(credits) {
  if (!credits || !credits.cast || !credits.cast.length) return '<p>Elenco indisponível.</p>';
  const cast = credits.cast.slice(0, 6);
  return `
    <div class="cast-grid">
      ${cast.map(c => `
        <div class="cast-card" onclick="window.location.href='/person/${c.id}/${encodeURIComponent(c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}'" style="cursor:pointer;">
          <img src="${c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : 'https://via.placeholder.com/185x278?text=Sem+Foto'}" alt="${escapeHtml(c.name)}" loading="lazy">
          <div class="cast-name">${escapeHtml(c.name)}</div>
          <div class="cast-character">${escapeHtml(c.character || '')}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function similarSection(similar) {
  if (!similar || !similar.results || !similar.results.length) return '';
  const cards = similar.results.slice(0, 6).map(item => posterCard(item, item.media_type || 'movie')).join('');
  return `
    <div class="section-block">
      <h3>Títulos Semelhantes</h3>
      <div class="grid">${cards}</div>
    </div>
  `;
}

function nativeBannerAd() {
  return `
    <div style="text-align:center; margin: 20px 0;">
      <script async="async" data-cfasync="false" src="https://bancadeltempoidea.org/21/6f7b03feb080b4884047d6210ed8268e"></script>
      <div id="container-6f7b03feb080b4884047d6210ed8268e"></div>
    </div>
  `;
}

function sideBannerAd() {
  return `
    <div style="text-align:center; margin: 20px 0;">
      <script>
        atOptions = {
          'key' : 'b4c5edd71dd22f2f3a51a8206816e9ac',
          'format' : 'iframe',
          'height' : 60,
          'width' : 468,
          'params' : {}
        };
      </script>
      <script src="https://bancadeltempoidea.org/22/b4c5edd71dd22f2f3a51a8206816e9ac"></script>
    </div>
  `;
}

function banner300x250Ad() {
  return `
    <div style="text-align:center; margin: 20px 0;">
      <script>
        atOptions = {
          'key' : '619e9f7dadd08146f364afc8090e514c',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      </script>
      <script src="https://bancadeltempoidea.org/22/619e9f7dadd08146f364afc8090e514c"></script>
    </div>
  `;
}

function banner160x600Ad() {
  return `
    <div style="text-align:center; margin: 20px 0;">
      <script>
        atOptions = {
          'key' : '25247fde261d8f76e06b91b9d74945f4',
          'format' : 'iframe',
          'height' : 600,
          'width' : 160,
          'params' : {}
        };
      </script>
      <script src="https://bancadeltempoidea.org/22/25247fde261d8f76e06b91b9d74945f4"></script>
    </div>
  `;
}

function banner320x50Ad() {
  return `
    <div style="text-align:center; margin: 20px 0;">
      <script>
        atOptions = {
          'key' : '374f3cbadfdea331b749dcfc79f79f2c',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      </script>
      <script src="https://bancadeltempoidea.org/22/374f3cbadfdea331b749dcfc79f79f2c"></script>
    </div>
  `;
}

function movieJsonLd(data, url) {
  const json = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": data.title,
    "description": data.overview,
    "image": data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : undefined,
    "datePublished": data.release_date,
    "url": url
  };
  return `<script type="application/ld+json">${JSON.stringify(json)}</script>`;
}

function tvJsonLd(data, url) {
  const json = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "name": data.name,
    "description": data.overview,
    "image": data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : undefined,
    "datePublished": data.first_air_date,
    "url": url
  };
  return `<script type="application/ld+json">${JSON.stringify(json)}</script>`;
}

module.exports = {
  head,
  layout,
  posterCard,
  genreRow,
  trailerBlock,
  castGrid,
  escapeHtml,
  movieJsonLd,
  tvJsonLd,
  nativeBannerAd,
  sideBannerAd,
  banner300x250Ad,
  banner160x600Ad,
  banner320x50Ad,
  similarSection,
  DEFAULT_TITLE,
  DEFAULT_DESC,
  SITE_NAME
};
