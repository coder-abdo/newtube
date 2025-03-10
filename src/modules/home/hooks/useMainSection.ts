import { TItem } from "@/types";
import { useAuth, useClerk } from "@clerk/nextjs";

export const useMainSection = () => {
  const clerk = useClerk();
  const { isSignedIn } = useAuth();

  const handleClick = (e: MouseEvent, item: TItem) => {
    if (!isSignedIn && item.auth) {
      e.preventDefault();
      return clerk.openSignIn();
    }
  };
  return { handleClick };
};
