import AccountBalance from "@mui/icons-material/AccountBalance";
import MusicNote from "@mui/icons-material/MusicNote";
import Movie from "@mui/icons-material/Movie";
import Domain from "@mui/icons-material/Domain";
import MenuBook from "@mui/icons-material/MenuBook";
import Science from "@mui/icons-material/Science";
import Palette from "@mui/icons-material/Palette";
import Memory from "@mui/icons-material/Memory";
import SportsSoccer from "@mui/icons-material/SportsSoccer";
import LiveTv from "@mui/icons-material/LiveTv";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Event from "@mui/icons-material/Event";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ComponentType } from "react";

const iconMap: Record<string, ComponentType<SvgIconProps>> = {
  history: AccountBalance,
  music: MusicNote,
  film: Movie,
  building: Domain,
  book: MenuBook,
  science: Science,
  art: Palette,
  computer: Memory,
  sport: SportsSoccer,
  "pop culture": LiveTv,
  personal: AccountCircle,
};

export default function CategoryIcon({
  type,
  ...props
}: { type: string } & SvgIconProps) {
  const Icon = iconMap[type] || Event;
  return <Icon {...props} />;
}
