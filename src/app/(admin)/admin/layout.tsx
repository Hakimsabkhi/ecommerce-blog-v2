import NavAdmin from "@/components/NavAdmin";
import HeaderAdmin from "@/components/menu/HeaderAdmin";
import { Poppins } from "next/font/google";
import "@/app/globals.css";

// Load the Google font
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`${poppins.className} w-full`}>
      <HeaderAdmin />
      <NavAdmin />
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;
