import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; // Ensure the path is correct
import SessionProviderWrapper from "@/components/ProviderComp/SessionProviderWrapper";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import "react-toastify/dist/ReactToastify.css";


const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en">
      <body className={poppins.className}>
        <SessionProviderWrapper session={session}>    
            {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
