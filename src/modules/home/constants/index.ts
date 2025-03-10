import {
  FlameIcon,
  HomeIcon,
  PlaySquareIcon,
  HistoryIcon,
  ListVideoIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { TItem } from "@/types";
const mainSectionItems: TItem[] = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Subscribitions",
    url: "/feed/subscriptions",
    icon: PlaySquareIcon,
    auth: true,
  },
  {
    title: "Trending",
    url: "/feed/trending",
    icon: FlameIcon,
  },
];
const personalItems: TItem[] = [
  {
    title: "History",
    url: "/playlists/history",
    icon: HistoryIcon,
    auth: true,
  },
  {
    title: "Liked Videos",
    url: "/playlists/liked",
    icon: ThumbsUpIcon,
    auth: true,
  },
  {
    title: "All Playlists",
    url: "/playlists",
    icon: ListVideoIcon,
    auth: true,
  },
];
export { mainSectionItems, personalItems };
