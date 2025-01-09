
import "@/app/globals.css";
import Footer from "@/components/menu/Footer";


const SubLayout = ({ children }: { children: React.ReactNode }) => {
  
  return (
    <div >
        <main>{children}</main>
        <Footer />
    </div>
  );
};

export default SubLayout;
