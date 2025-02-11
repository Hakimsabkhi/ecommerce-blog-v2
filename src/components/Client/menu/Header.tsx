
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import Headertop from "@/components/Client/menu/Headertop";
import HeaderBottom from "@/components/Client/menu/Headerbottom";
import LogoComponent from "@/components/Client/menu/LogoComponent";
import SearchBar from "@/components/Client/menu/SearchBar";
import CartLogic from "@/components/Client/menu/cart/CartLogic";
import Wishlist from "@/components/Client/menu/Wishlist";
import UserMenu from "@/components/Client/user/UserMenu";

const Header = async () => {
  // Fetch the session on the server-side
  const session = await getServerSession(authOptions);

  return (
    <>
      <Headertop />
      <div className="w-full h-[80px] bg-primary flex justify-center items-center max-lg:justify-around gap-4 border-y border-gray-600">
        <div className="w-[90%] flex justify-between items-center max-lg:justify-around gap-4 min-h-[150px]">
          <LogoComponent />
          <SearchBar />
          <div className="flex">
            <CartLogic />
            <Wishlist />
            <UserMenu session={session} />
          </div>
        </div>
      </div>
      <HeaderBottom />
    </>
  );
};

export default Header;
