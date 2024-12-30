import { Poppins } from "next/font/google";
import "@/app/globals.css";
import Footer from "@/components/menu/Footer";
import Header from "@/components/menu/Header";
import StoreProviders from "@/components/ProviderComp/StoreProvider";

// Load the Google font
const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Include all weights
  style: ["normal", "italic"], // Include both normal and italic styles
  display: "swap", // Optional: Use font-display: swap for better performance
});

const SubLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`${poppins.className} w-full`}>
      <StoreProviders>
        <Header />
        <main>{children}</main>
        <Footer />
      </StoreProviders>
    </div>
  );
};

export default SubLayout;
