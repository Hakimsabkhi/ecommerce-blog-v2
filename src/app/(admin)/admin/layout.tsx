
import NavAdmin from "@/components/NavAdmin";
import StoreProviders from "@/components/ProviderComp/StoreProvider";
import { Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/app/globals.css";

import HeaderAdmin from "@/components/menu/HeaderAdmin";
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  // Fetch the session server-side


  return (
    <html lang="en">
     <body className={`${poppins.className} w-full`}>
 
    <StoreProviders>
    <HeaderAdmin/>
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
      <NavAdmin  />
      {children}    

    </StoreProviders>
 
    </body>
    </html>
  );
};

export default RootLayout;
