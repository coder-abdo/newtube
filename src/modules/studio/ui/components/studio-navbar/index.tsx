import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import { StudioUploadModal } from "../studio-upload-modal";

type Props = {};
export const StudioNavbar: FC<Props> = () => {
  return (
    <nav className="sticky capitalize top-0 left-0 right-0 bg-white flex items-center pl-2 h-16 pr-5 z-50 border-b shadow-md">
      <div className="flex items-center gap-4 w-full">
        {/* menu and logo */}
        <div className="flex gap-4 items-center flex-shrink-0">
          <SidebarTrigger />
          <Link href="/studio" className="flex items-center gap-2">
            <Image
              src="logo.svg"
              alt="new youtube logo"
              width={32}
              height={32}
            />
            <span className="text-xl font-semibold tracking-tight">Studio</span>
          </Link>
        </div>
        {/* end of sidebar */}
        {/* spacer  */}
        <div className="flex-1" />
        {/* end of spacer */}
        {/* auth buttons */}
        <div className="flex-shrink-0 items-center flex gap-4">
          <StudioUploadModal />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};
