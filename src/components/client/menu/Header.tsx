
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import Headertop from "@/components/client/menu/Headertop";
import HeaderBottom from "@/components/client/menu/Headerbottom";
import LogoComponent from "@/components/client/menu/LogoComponent";
import SearchBar from "@/components/client/menu/SearchBar";
import CartLogic from "@/components/client/menu/cart/CartLogic";
import Wishlist from "@/components/client/menu/Wishlist";
import UserMenu from "@/components/client/user/UserMenu";

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
