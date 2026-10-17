import React from "react";
import type { CategoryFilterProps } from "./Genrefilter.types";

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  options,
  selectedValue,
  onSelectValue,
  totalDiscos,
}) => {
  return (
    <div className="filter-categories-wrapper">
      <div className="category-buttons-row">
        <span className="category-label">
          <span>🔘</span> Filtrar por:
        </span>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-btn ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => onSelectCategory(cat.id)}
          >
             <span className="cat-icon">{cat.icon}</span>{cat.label}
          </button>
        ))}
      </div>

      <div className="subfilter-container">
        <button
          className={`filter-chip ${selectedValue === "Todos" ? "active" : ""}`}
          onClick={() => onSelectValue("Todos")}
        >
          Todos ({totalDiscos})
        </button>

        {options.map((opt) => (
          <button
            key={String(opt.id || opt.value)}
            className={`filter-chip ${selectedValue === opt.value ? "active" : ""}`}
            onClick={() => onSelectValue(opt.value)}
          >
            {opt.label} {opt.count !== undefined ? `(${opt.count})` : ""}
          </button>
        ))}

        {selectedValue !== "Todos" && (
          <div className="active-filter-badge">
            <span>
              {activeCategory.toUpperCase()}: {selectedValue}
            </span>
            <button
              className="clear-filter-btn"
              title="Remover filtro"
              onClick={() => onSelectValue("Todos")}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
