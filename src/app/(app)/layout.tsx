import "~/styles/globals.css";

import { NavbarApp } from "~/components/layout/navbar-app";
import { Footer } from "~/components/layout/footer";

export const metadata = {
  title: "T-Record",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarApp />
      {children}
      <Footer />
    </>
  );
}
