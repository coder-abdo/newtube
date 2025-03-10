import { HomeLayout } from "@/modules/home/ui/layouts/home-layout";
import { TlayoutProps } from "@/types";

export default function Layout({ children }: TlayoutProps) {
  return <HomeLayout>{children}</HomeLayout>;
}
