import type { SVGProps } from "react";
import {
  AccountBalance, MusicNote, Movie, Domain, MenuBook,
  ScienceIcon, PaletteIcon, MemoryIcon, SportsSoccer,
  LiveTv, AccountCircle, EventIcon,
} from "@/components/Icon";

type IconComponent = (props: SVGProps<SVGSVGElement> & { size?: number }) => React.JSX.Element;

const iconMap: Record<string, IconComponent> = {
  history: AccountBalance,
  music: MusicNote,
  film: Movie,
  building: Domain,
  book: MenuBook,
  science: ScienceIcon,
  art: PaletteIcon,
  computer: MemoryIcon,
  sport: SportsSoccer,
  "pop culture": LiveTv,
  personal: AccountCircle,
};

export default function CategoryIcon({
  type,
  size,
  ...props
}: { type: string; size?: number } & SVGProps<SVGSVGElement>) {
  const Icon = iconMap[type] || EventIcon;
  return <Icon size={size} {...props} />;
}
