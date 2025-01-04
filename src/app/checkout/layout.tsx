
import "@/app/globals.css";
import StoreProviders from "@/components/ProviderComp/StoreProvider";


const SubLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-[90%] mx-auto" >
      <StoreProviders>
        <main>{children}</main>
      </StoreProviders>
    </div>
  );
};

export default SubLayout;
