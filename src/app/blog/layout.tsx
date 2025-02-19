

import Footer from "@/components/Client/menu/Footer";


const SubLayout = ({ children }: { children: React.ReactNode }) => {
  
  return (
    <>
        {children}
        <Footer />
    </>
  );
};

export default SubLayout;
