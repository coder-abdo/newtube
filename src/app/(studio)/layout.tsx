import { StudioLayout } from "@/modules/studio/ui/layouts/studio-layout";
import { TlayoutProps } from "@/types";

export default function Layout({ children }: TlayoutProps) {
  return <StudioLayout>{children}</StudioLayout>;
}
