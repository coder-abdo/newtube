import { useIsMobile } from "@/hooks/use-mobile";
import { ResponsiveDialogProps } from "@/types";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export const ResponsiveDialog: React.FC<ResponsiveDialogProps> = ({
  title,
  isOpen,
  onOpenChange,
  children,
}) => {
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
