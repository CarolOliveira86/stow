export interface VinilApiItem {
  CODIGO?: string | number;
  BANDA: string;
  ALBUM: string;
  GENERO: string;
  GRAVADORA?: string;
  "ANO DO VINIL"?: string | number;
  VALOR?: string | number;
  LOCAL?: string;
  VENDEDOR?: string;
  QUANTIDADE?: number;
  SERIE?: string;
  "DATA DE COMPRA"?: string;
  MES?: string;
  N?: number;
}

export interface MusicItem {
  id: string | number;
  codigo?: string | number;
  banda: string;
  album: string;
  genero: string;
  gravadora: string;
  ano: string | number;
  valor?: string | number;
  local: string;
  vendedor: string;
  quantidade?: number;
  serie?: string;
  dataCompra?: string;
}


export interface Genero {
  id: string | number;
  name: string;
  total?: number;
}

export interface Nome {
  id: string | number;
  title: string;
  artist: string;
  genreId?: string | number;
  total?: number;
}

export interface Ano {
  id: string | number;
  name: string;
  slug?: string;
  total?: number;
}

export interface Gravadora {
  id: string | number;
  name: string;
  total?: number;
}

export interface Vendedor {
  id: string | number;
  name: string;
  total?: number;
}

export interface Local {
  id: string | number;
  name: string;
  total?: number;
}


export type FilterCategory = 'genero' | 'nome' | 'alfabeto' | 'ano' | 'gravadora' | 'vendedor' | 'local';

export interface MusicFilterParams {
  category?: FilterCategory;
  genreId?: string | number;
  genero?: string;
  nome?: string;
  alfabeto?: string;
  letra?: string;
  ano?: string | number;
  gravadora?: string;
  vendedor?: string;
  local?: string;
  searchQuery?: string;
}


export interface FilterOption {
  id: string | number;
  label: string;
  value: string;
  category: FilterCategory;
  count?: number;
  genero?: string;
  artist?: string;
  title?: string;
  ano?: string | number;
  gravadora?: string;
  vendedor?: string;
  local?: string;
}

export interface GeneroFilterOption extends FilterOption {
  category: 'genero';
}

export interface NomeFilterOption extends FilterOption {
  category: 'nome';
  artist?: string;
  title?: string;
}

export interface AnoFilterOption extends FilterOption {
  category: 'ano';
  ano?: string | number;
}

export interface GravadoraFilterOption extends FilterOption {
  category: 'gravadora';
}

export interface VendedorFilterOption extends FilterOption {
  category: 'vendedor';
}

export interface LocalFilterOption extends FilterOption {
  category: 'local';
}


export interface MusicFiltersData {
  generos: Genero[];
  nomes: Nome[];
  anos: Ano[];
  gravadoras: Gravadora[];
  vendedores: Vendedor[];
  locais: Local[];
}


export interface ApiResponse {
  data: VinilApiItem[];
  total: number;
  totalBandas?: number;
  generos: Genero[];
  nomes: Nome[];
  anos: Ano[];
  gravadoras: Gravadora[];
  vendedores: Vendedor[];
  locais: Local[];
}