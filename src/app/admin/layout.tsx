import NavAdmin from "@/components/NavAdmin";
import HeaderAdmin from "@/components/menu/HeaderAdmin";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import { ToastContainer } from "react-toastify";

// Load the Google font
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`${poppins.className} w-full flex flex-col`}>
      <ToastContainer
              position="top-center"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
      <HeaderAdmin />
      <NavAdmin />
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;
