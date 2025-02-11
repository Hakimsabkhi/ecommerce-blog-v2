

import Footer from "@/components/Client/menu/Footer";
import Header from "@/components/Client/menu/Header";
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
