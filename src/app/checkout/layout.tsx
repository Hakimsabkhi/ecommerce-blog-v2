

import StoreProviders from "@/components/Provider/StoreProvider";


const SubLayout = ({ children }: { children: React.ReactNode }) => {
  return (
      <StoreProviders>
        {children}
      </StoreProviders>
  );
};

export default SubLayout;
