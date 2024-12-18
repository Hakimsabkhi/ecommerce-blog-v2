

import React from "react";
import Image from "next/image";
import Link from "next/link";


async function fetchCompanyData() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/company/getCompany`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next:{revalidate:0}
    });
  if (!res.ok) {
      console.log('Failed to fetch data');
  }
  return res.json();
}


const Header: React.FC = async() => {
  const companyData = await fetchCompanyData();
  return (
    
      <div className="flex w-fit max-lg:w-[50%] gap-4 items-center justify-around">
        <Link href="/" aria-label="Home page">    
          <Image
              width={300}
              height={300}
              className="w-[300px]"
              src={companyData?.logoUrl}
              alt="Luxe Home logo"
            />
        </Link>       
      </div>
  
  );
};

export default Header;
