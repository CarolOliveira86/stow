import React from "react";
import type { VinilApiItem } from "../../types/music.types";
import { MusicCard } from "./MusicCard";

interface MusicListProps {
  vinis: VinilApiItem[];
}

export const MusicList: React.FC<MusicListProps> = ({ vinis }) => {
  return (
    <div className="grid-cards">
      {vinis.map((item, index) => (
        <MusicCard key={item.CODIGO || index} vinil={item} />
      ))}
    </div>
  );
};

export default MusicList;
