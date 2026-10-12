import { useState, useEffect, useMemo } from "react"
import "./app.css"


const GITHUB_RAW_URL =
  "https://gist.githubusercontent.com/CarolOliveira86/dcdf97a3e6fab1be5e86aeccf575156e/raw/160a1891e4846bf93c0dc5a2b18ed45f7e06fd25/gistfile1.txt"

const ITEMS_PER_PAGE = 24

function App() {
  const [vinis, setVinis] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("Todos")
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)


  useEffect(() => {
    const carregarVinis = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(GITHUB_RAW_URL)

        if (!response.ok) {
          throw new Error(`Falha na requisição HTTP: ${response.status} (${response.statusText})`)
        }

        const data = await response.json()
        setVinis(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || "Não foi possível carregar o arquivo JSON do GitHub.")
      } finally {
        setLoading(false)
      }
    }

    carregarVinis()
  }, [])

 
  const generosDisponiveis = useMemo(() => {
    const generosMap = {}
    vinis.forEach((item) => {
      if (item.GENERO && typeof item.GENERO === "string") {
        const generoTrim = item.GENERO.trim()
        generosMap[generoTrim] = (generosMap[generoTrim] || 0) + 1
      }
    })

   
    return Object.entries(generosMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([nome]) => nome)
  }, [vinis])


  const vinisFiltrados = useMemo(() => {
    const termo = searchTerm.toLowerCase().trim()

    return vinis.filter((item) => {
   
      if (selectedGenre !== "Todos" && item.GENERO !== selectedGenre) {
        return false
      }

 
      if (!termo) return true

  
      const banda = String(item.BANDA || "").toLowerCase()
      const album = String(item.ALBUM || "").toLowerCase()
      const genero = String(item.GENERO || "").toLowerCase()
      const gravadora = String(item.GRAVADORA || "").toLowerCase()
      const ano = String(item["ANO DO VINIL"] || "").toLowerCase()

      return (
        banda.includes(termo) ||
        album.includes(termo) ||
        genero.includes(termo) ||
        gravadora.includes(termo) ||
        ano.includes(termo)
      )
    })
  }, [vinis, searchTerm, selectedGenre])


  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE)
  }, [searchTerm, selectedGenre])

 
  const vinisExibidos = vinisFiltrados.slice(0, visibleCount)


  const totalBandas = useMemo(() => {
    const bandas = new Set(vinis.map((v) => v.BANDA).filter(Boolean))
    return bandas.size
  }, [vinis])


  const limparBusca = () => {
    setSearchTerm("")
  }

  return (
    <div className="app-wrapper">

      <header className="header-hero">
        <h1 className="hero-title">
          <img src="/logo.png" alt="De Volta Para o Vinil" className="hero-logo" />
        </h1>
        <p className="hero-subtitle">
          Catálogo completo carregado em tempo real a partir do JSON no GitHub.
        </p>

 
        {!loading && !error && vinis.length > 0 && (
          <div className="stats-bar">
            <div className="stat-item">
              <span>Discos no Acervo:</span>
              <strong>{vinis.length.toLocaleString("pt-BR")}</strong>
            </div>
            <div className="stat-item">
              <span>Artistas/Bandas:</span>
              <strong>{totalBandas.toLocaleString("pt-BR")}</strong>
            </div>
          </div>
        )}
      </header>

      <section className="search-section">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por banda, álbum, gênero, gravadora ou ano (ex: AC/DC, Samba, 1980)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-btn"
              title="Limpar busca"
              onClick={limparBusca}
            >
              ✕
            </button>
          )}
        </div>

       
        {!loading && generosDisponiveis.length > 0 && (
          <div className="filters-row">
            <span className="filter-label">Gênero:</span>
            <button
              className={`genre-tag ${selectedGenre === "Todos" ? "active" : ""}`}
              onClick={() => setSelectedGenre("Todos")}
            >
              Todos ({vinis.length})
            </button>
            {generosDisponiveis.map((gen) => (
              <button
                key={gen}
                className={`genre-tag ${selectedGenre === gen ? "active" : ""}`}
                onClick={() => setSelectedGenre(gen)}
              >
                {gen}
              </button>
            ))}
          </div>
        )}
      </section>


      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}


      {loading && (
        <div className="status-container">
          <div className="loader-spinner"></div>
          <p>Carregando catálogo de vinis do GitHub...</p>
        </div>
      )}

    
      {!loading && !error && vinisFiltrados.length === 0 && (
        <div className="status-container">
          <p style={{ fontSize: "1.2rem", marginBottom: "8px" }}>
            Nenhum Vinil encontrado para a busca "{searchTerm}".
          </p>
          <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>
            Tente pesquisar por outro Nome de Artista, Gênero ou Ano.
          </p>
          {searchTerm && (
            <button
              type="button"
              className="load-more-btn"
              style={{ maxWidth: "200px", margin: "0 auto" }}
              onClick={limparBusca}
            >
              Limpar busca
            </button>
          )}
        </div>
      )}

     
      {!loading && vinisFiltrados.length > 0 && (
        <>
          <div className="results-info">
            <span className="results-count">
              Exibindo <strong>{Math.min(visibleCount, vinisFiltrados.length)}</strong> de{" "}
              <strong>{vinisFiltrados.length}</strong> discos encontrados
            </span>
          </div>

          <div className="grid-cards">
            {vinisExibidos.map((item, index) => {
              const banda = item.BANDA || "Artista Desconhecido"
              const album = item.ALBUM || "Sem título"
              const ano = item["ANO DO VINIL"] || "Ano N/A"
              const genero = item.GENERO || "Diversos"
              const gravadora = item.GRAVADORA || "Independente"
              const valor = item.VALOR || "R$ --"
              const local = item.LOCAL || "Acervo"
              const vendedor = item.VENDEDOR || "Coleção"

              return (
                <article key={item.CODIGO || index} className="vinyl-card">
                 
                  <div className="card-top">
                    <div className="vinyl-disc-art">
                      <div className="vinyl-center-hole"></div>
                    </div>
                    <div className="badges-group">
                      <span className="badge-year">{ano}</span>
                      <span className="badge-genre" title={genero}>
                        {genero}
                      </span>
                    </div>
                  </div>

                
                  <div className="card-content">
                    <h2 className="band-name" title={String(banda)}>
                      {banda}
                    </h2>
                    <h3 className="album-name" title={String(album)}>
                      {album}
                    </h3>

                   
                    <div className="spec-list">
                      <div className="spec-item">
                        <span className="spec-label">Gravadora</span>
                        <span className="spec-value" title={String(gravadora)}>
                          {gravadora}
                        </span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Local</span>
                        <span className="spec-value" title={String(local)}>
                          {local}
                        </span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Origem</span>
                        <span className="spec-value" title={String(vendedor)}>
                          {vendedor}
                        </span>
                      </div>
                      {/* <div className="spec-item">
                        <span className="spec-label">Qtd</span>
                        <span className="spec-value">
                          {item.QUANTIDADE !== undefined ? item.QUANTIDADE : 1} un.
                        </span>
                      </div> */}
                    </div>

                  
                    <div className="card-footer">
                      <span className="price-tag">{valor}</span>
                      <span className="seller-tag">
                        📍 {local}
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

         
          {visibleCount < vinisFiltrados.length && (
            <div className="load-more-container">
              <button
                className="load-more-btn"
                onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
              >
                Carregar mais discos ({vinisFiltrados.length - visibleCount} restantes) ↓
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default App
