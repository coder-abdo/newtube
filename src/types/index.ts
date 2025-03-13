import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import {
  VideoAssetReadyWebhookEvent,
  VideoAssetCreatedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
VideoAssetDeletedWebhookEvent
} from "@mux/mux-node/resources/webhooks";

type TlayoutProps = {
  children: ReactNode;
};
type TItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  auth?: boolean;
};
type CategoriesSectionProps = {
  categoryId?: string;
};
type HomePageProps = {
  searchParams: Promise<{
    categoryId?: string;
  }>;
};
type ResponsiveDialogProps = {
  children: ReactNode;
  isOpen: boolean;
  title: string;
  onOpenChange: (isOpen: boolean) => void;
};

type StudioUploaderProps = {
  endpoint?: string | null;
  onSuccess: () => void;
};
type WebhookEvent =
  | VideoAssetTrackReadyWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetCreatedWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetDeletedWebhookEvent;
export type {
  TlayoutProps,
  TItem,
  CategoriesSectionProps,
  HomePageProps,
  ResponsiveDialogProps,
  StudioUploaderProps,
  WebhookEvent,
};
