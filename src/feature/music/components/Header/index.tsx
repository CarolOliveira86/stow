import React from "react";

interface HeaderProps {
  totalDiscos: number;
  totalBandas: number;
  loading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ totalDiscos, totalBandas, loading }) => {
  return (
    <header className="header-hero">
      <h1 className="hero-title"> 
        <img src="logo.png" alt="De volta para o vinil" />       
      </h1>
      <p className="hero-subtitle">
        Registro do acervo de vinis. Desde 2008
      </p>

      {!loading && totalDiscos > 0 && (
        <div className="stats-bar">
          <div className="stat-item">
            <span>Discos no Acervo:</span>
            <strong>{totalDiscos.toLocaleString("pt-BR")}</strong>
          </div>
          <div className="stat-item">
            <span>Artistas/Bandas:</span>
            <strong>{totalBandas.toLocaleString("pt-BR")}</strong>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
