import React from "react";
import  type { VinilApiItem } from "../../types/music.types";

interface MusicCardProps {
  vinil: VinilApiItem;
}

export const MusicCard: React.FC<MusicCardProps> = ({ vinil }) => {
  const banda = vinil.BANDA || "Artista Desconhecido";
  const album = vinil.ALBUM || "Sem título";
  const ano = vinil["ANO DO VINIL"] || "Ano N/A";
  const genero = vinil.GENERO || "Diversos";
  const gravadora = vinil.GRAVADORA || "Independente";
  const valor = vinil.VALOR || "R$ --";
  const local = vinil.LOCAL || "Acervo";
  const vendedor = vinil.VENDEDOR || "Coleção";

  return (
    <article className="vinyl-card">
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
        </div>

        <div className="card-footer">
          <span className="price-tag">{valor}</span>
          <span className="seller-tag">📍 {local}</span>
        </div>
      </div>
    </article>
  );
};

export default MusicCard;