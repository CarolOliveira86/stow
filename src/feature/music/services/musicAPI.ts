
import type {
  VinilApiItem,
  Genero,
  Nome,
  Ano,
  Gravadora,
  Vendedor,
  Local,
  ApiResponse,
} from "../types/music.types";

export const GITHUB_RAW_URL =
  "https://gist.githubusercontent.com/CarolOliveira86/dcdf97a3e6fab1be5e86aeccf575156e/raw/160a1891e4846bf93c0dc5a2b18ed45f7e06fd25/gistfile1.txt";


export async function carregarVinisAPI(): Promise<VinilApiItem[]> {
  const response = await fetch(GITHUB_RAW_URL);

  if (!response.ok) {
    throw new Error(
      `Falha na requisição HTTP: ${response.status} (${response.statusText})`
    );
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}


export function extrairGeneros(vinis: VinilApiItem[]): Genero[] {
  const contagem: Record<string, number> = {};
  vinis.forEach((item) => {
    if (item.GENERO && typeof item.GENERO === "string") {
      const g = item.GENERO.trim();
      if (g) contagem[g] = (contagem[g] || 0) + 1;
    }
  });

  return Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .map(([name, total], idx) => ({ id: idx + 1, name, total }));
}


export function extrairNomes(vinis: VinilApiItem[]): Nome[] {
  const contagem: Record<string, { artist: string; title: string; count: number }> = {};
  vinis.forEach((item) => {
    const artist = (item.BANDA || "").toString().trim();
    const title = (item.ALBUM || "").toString().trim();
    if (artist) {
      if (!contagem[artist]) {
        contagem[artist] = { artist, title, count: 0 };
      }
      contagem[artist].count++;
    }
  });

  return Object.entries(contagem)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([artist, info], idx) => ({
      id: idx + 1,
      artist,
      title: info.title,
      total: info.count,
    }));
}


export function extrairAnos(vinis: VinilApiItem[]): Ano[] {
  const contagem: Record<string, number> = {};
  vinis.forEach((item) => {
    const ano = (item["ANO DO VINIL"] || "").toString().trim();
    if (ano) {
      contagem[ano] = (contagem[ano] || 0) + 1;
    }
  });

  return Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .map(([name, total], idx) => ({
      id: idx + 1,
      name,
      slug: name,
      total,
    }));
}


export function extrairGravadoras(vinis: VinilApiItem[]): Gravadora[] {
  const contagem: Record<string, number> = {};
  vinis.forEach((item) => {
    const gravadora = (item.GRAVADORA || "").toString().trim();
    if (gravadora) {
      contagem[gravadora] = (contagem[gravadora] || 0) + 1;
    }
  });

  return Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .map(([name, total], idx) => ({
      id: idx + 1,
      name,
      total,
    }));
}


export function extrairVendedores(vinis: VinilApiItem[]): Vendedor[] {
  const contagem: Record<string, number> = {};
  vinis.forEach((item) => {
    const vendedor = (item.VENDEDOR || "").toString().trim();
    if (vendedor) {
      contagem[vendedor] = (contagem[vendedor] || 0) + 1;
    }
  });

  return Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .map(([name, total], idx) => ({
      id: idx + 1,
      name,
      total,
    }));
}


export function extrairLocais(vinis: VinilApiItem[]): Local[] {
  const contagem: Record<string, number> = {};
  vinis.forEach((item) => {
    const local = (item.LOCAL || "").toString().trim();
    if (local) {
      contagem[local] = (contagem[local] || 0) + 1;
    }
  });

  return Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .map(([name, total], idx) => ({
      id: idx + 1,
      name,
      total,
    }));
}


export async function carregarAcervoComFiltros(): Promise<ApiResponse> {
  const data = await carregarVinisAPI();
  const bandasUnicas = new Set(data.map((v) => v.BANDA).filter(Boolean));

  return {
    data,
    total: data.length,
    totalBandas: bandasUnicas.size,
    generos: extrairGeneros(data),
    nomes: extrairNomes(data),
    anos: extrairAnos(data),
    gravadoras: extrairGravadoras(data),
    vendedores: extrairVendedores(data),
    locais: extrairLocais(data),
  };
}