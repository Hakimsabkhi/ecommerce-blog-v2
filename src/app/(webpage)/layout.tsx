import { Poppins } from "next/font/google";
import "@/app/globals.css";
import Footer from "@/components/menu/Footer";
import Header from "@/components/menu/Header";

// Load the Google font
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

const SubLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`${poppins.className} w-full`}>
        <Header />
        <main>{children}</main>
        <Footer />
    </div>
  );
};

export default SubLayout;
