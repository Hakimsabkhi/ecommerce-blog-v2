import { Poppins } from "next/font/google";
import "@/app/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StoreProviders from "@/components/ProviderComp/StoreProvider";
import Footer from "@/components/menu/Footer";
import Header from "@/components/menu/Header";

// Load the Google font
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });



const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={`${poppins.className} w-full`}>
        <StoreProviders>
          <Header />
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
          {children}
          <Footer />
        </StoreProviders>
      </body>
    </html>
  );
};

export default RootLayout;
