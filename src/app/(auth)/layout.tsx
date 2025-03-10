import type { TlayoutProps } from "@/types";

const AuthLayout = ({ children }: TlayoutProps) => {
  return (
    <main className="min-h-screen flex justify-center items-center">
      {children}
    </main>
  );
};
export default AuthLayout;
