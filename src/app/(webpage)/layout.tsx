
import "@/app/globals.css";
import Footer from "@/components/client/menu/Footer";
import Header from "@/components/client/menu/Header";
import StoreProviders from "@/components/Provider/StoreProvider";


const SubLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div >
      <StoreProviders>
        <Header />
        {children}
        <Footer />
      </StoreProviders>
    </div>
  );
};

export default SubLayout;
