import React, { useState, useEffect, useMemo } from "react";
import type { VinilApiItem, FilterCategory, FilterOption } from "../types/music.types";
import { carregarVinisAPI } from "../services/musicAPI";
import { Header } from "./Header";
import { CategoryFilter } from "./GenreFilter";
import type { CategoryButtonConfig } from "./GenreFilter/Genrefilter.types";
import { MusicList } from "./MusicList";

const ITEMS_PER_PAGE = 24;

const CATEGORIAS_CONFIG: CategoryButtonConfig[] = [
  { id: "genero", label: "Gênero" },
  { id: "nome", label: "Nome" },
  { id: "ano", label: "Ano" },
  { id: "gravadora", label: "Gravadora" },
  { id: "vendedor", label: "Vendedor" },
  { id: "local", label: "Local" },
];

export const MusicContainer: React.FC = () => {
  const [vinis, setVinis] = useState<VinilApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("genero");
  const [selectedValue, setSelectedValue] = useState("Todos");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const [selectedLetter, setSelectedLetter] = useState<string>("");

  useEffect(() => {
    const carregar = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await carregarVinisAPI();
        setVinis(data);
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Não foi possível carregar o arquivo JSON do acervo.";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, []);

  const vinisPorLetra = useMemo(() => {
    const categoriasComSubfiltroLetra: FilterCategory[] = ["nome", "gravadora"];

    if (!categoriasComSubfiltroLetra.includes(activeCategory) || !selectedLetter) {
      return vinis;
    }

    return vinis.filter((item) => {
      let nomeRef = "";

      if (activeCategory === "nome") {
        nomeRef = (item.BANDA || item.ALBUM || "").trim().toUpperCase();
      } else if (activeCategory === "gravadora") {
        nomeRef = (item.GRAVADORA || "").trim().toUpperCase();
      }

      return nomeRef.startsWith(selectedLetter);
    });
  }, [vinis, activeCategory, selectedLetter]);

  const opcoesPorCategoria = useMemo(() => {
    const extrair = (
      campo: string | ((item: VinilApiItem) => string | undefined),
      categoria: FilterCategory,
      maxItens = 20
    ): FilterOption[] => {
      const mapa: Record<string, number> = {};
      vinisPorLetra.forEach((item) => {
        const val = typeof campo === "function" ? campo(item) : (item as Record<string, any>)[campo];
        const valTrim = (val || "").toString().trim();
        if (valTrim) {
          mapa[valTrim] = (mapa[valTrim] || 0) + 1;
        }
      });
      return Object.entries(mapa)
        .sort((a, b) => b[1] - a[1])
        .slice(0, maxItens)
        .map(([value, count], idx) => ({
          id: idx + 1,
          label: value,
          value,
          category: categoria,
          count,
        }));
    };

    return {
      genero: extrair("GENERO", "genero", 20),
      nome: extrair((item) => item.BANDA || item.ALBUM, "nome", 20),
      ano: extrair("ANO DO VINIL", "ano", 20),
      gravadora: extrair("GRAVADORA", "gravadora", 20),
      vendedor: extrair("VENDEDOR", "vendedor", 20),
      local: extrair("LOCAL", "local", 20),
    };
  }, [vinisPorLetra]);

  const vinisFiltrados = useMemo(() => {
    const termo = searchTerm.toLowerCase().trim();

    return vinisPorLetra.filter((item) => {
      if (selectedValue !== "Todos") {
        let valorItem = "";
        if (activeCategory === "genero") valorItem = item.GENERO || "";
        else if (activeCategory === "nome") valorItem = item.BANDA || item.ALBUM || "";
        else if (activeCategory === "ano") valorItem = String(item["ANO DO VINIL"] || "");
        else if (activeCategory === "gravadora") valorItem = item.GRAVADORA || "";
        else if (activeCategory === "vendedor") valorItem = item.VENDEDOR || "";
        else if (activeCategory === "local") valorItem = item.LOCAL || "";

        if (valorItem.trim().toLowerCase() !== selectedValue.trim().toLowerCase()) {
          return false;
        }
      }

      if (!termo) return true;

      const banda = String(item.BANDA || "").toLowerCase();
      const album = String(item.ALBUM || "").toLowerCase();
      const genero = String(item.GENERO || "").toLowerCase();
      const gravadora = String(item.GRAVADORA || "").toLowerCase();
      const ano = String(item["ANO DO VINIL"] || "").toLowerCase();
      const vendedor = String(item.VENDEDOR || "").toLowerCase();
      const local = String(item.LOCAL || "").toLowerCase();

      return (
        banda.includes(termo) ||
        album.includes(termo) ||
        genero.includes(termo) ||
        gravadora.includes(termo) ||
        ano.includes(termo) ||
        vendedor.includes(termo) ||
        local.includes(termo)
      );
    });
  }, [vinisPorLetra, searchTerm, activeCategory, selectedValue]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchTerm, activeCategory, selectedValue, selectedLetter]);

  const totalBandas = useMemo(() => {
    const bandas = new Set(vinis.map((v) => v.BANDA).filter(Boolean));
    return bandas.size;
  }, [vinis]);

  const vinisExibidos = vinisFiltrados.slice(0, visibleCount);
  const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const exibeSubfiltroAlfabetico = activeCategory === "nome" || activeCategory === "gravadora";

  return (
    <div>
      <Header totalDiscos={vinis.length} totalBandas={totalBandas} loading={loading} />

      <section className="search-section">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por banda, álbum, gênero, gravadora, ano, vendedor ou local (ex: AC/DC, Samba, 1980)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-btn"
              title="Limpar busca"
              onClick={() => setSearchTerm("")}
            >
              ✕
            </button>
          )}
        </div>

        {!loading && vinis.length > 0 && (
          <>
            {/* 1. Renderizamos apenas a seleção de categorias principais */}
            <CategoryFilter
              categories={CATEGORIAS_CONFIG}
              activeCategory={activeCategory}
              onSelectCategory={(cat) => {
                setActiveCategory(cat);
                setSelectedValue("Todos");
                if (cat !== "nome" && cat !== "gravadora") setSelectedLetter("");
              }}
              options={[]} 
              selectedValue={selectedValue}
              onSelectValue={(val) => setSelectedValue(val)}
              totalDiscos={vinis.length}
            />

            {/* 2. Bloco único unificado do subfilter-container contendo o alfabeto e as opções */}
            <div className="subfilter-container">
              {exibeSubfiltroAlfabetico && (
                <div className="alphabet-filter">
                  <button
                    type="button"
                    onClick={() => setSelectedLetter("")}
                    className={`letter-btn ${selectedLetter === "" ? "active" : ""}`}
                  >
                    Todas as Letras
                  </button>
                  {alfabeto.map((letra) => (
                    <button
                      key={letra}
                      type="button"
                      onClick={() => setSelectedLetter(letra)}
                      className={`letter-btn ${selectedLetter === letra ? "active" : ""}`}
                    >
                      {letra}
                    </button>
                  ))}
                </div>
              )}

              <div className="options-filter">
                <button
                  type="button"
                  onClick={() => setSelectedValue("Todos")}
                  className={`option-btn ${selectedValue === "Todos" ? "active" : ""}`}
                >
                  Todos ({vinisPorLetra.length})
                </button>
                {opcoesPorCategoria[activeCategory]?.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedValue(opt.value)}
                    className={`option-btn ${selectedValue === opt.value ? "active" : ""}`}
                  >
                    {opt.label} ({opt.count})
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </section>

      {error && <div className="error-banner">⚠️ {error}</div>}

      {loading && (
        <div className="status-container">
          <div className="loader-spinner"></div>
          <p>Carregando catálogo de vinis...</p>
        </div>
      )}

      {!loading && !error && vinisFiltrados.length === 0 && (
        <div className="status-container">
          <p style={{ fontSize: "1.2rem", marginBottom: "8px" }}>
            Nenhum Vinil encontrado para os filtros selecionados.
          </p>
          <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>
            Tente pesquisar por outro termo ou selecione outra letra no alfabeto.
          </p>
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

          <MusicList vinis={vinisExibidos} />

          {visibleCount < vinisFiltrados.length && (
            <div className="load-more-container">
              <button
                type="button"
                className="load-more-btn"
                onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
              >
                Carregando mais discos ({vinisFiltrados.length - visibleCount} restantes) ↓
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MusicContainer;