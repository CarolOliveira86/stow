import type { FilterCategory, FilterOption } from "../../types/music.types";

export interface CategoryButtonConfig {
  id: FilterCategory;
  label: string;
  icon?: string;
}

export interface CategoryFilterProps {
  categories: CategoryButtonConfig[];
  activeCategory: FilterCategory;
  onSelectCategory: (category: FilterCategory) => void;
  options: FilterOption[];
  selectedValue: string;
  onSelectValue: (value: string) => void;
  totalDiscos: number;
}