import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa"; // Import social media icons



async function fetchCompanyData() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/company/getCompany`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    console.log("Failed to fetch data");
  }
  return res.json();
}

const Headertop: React.FC = async () => {
  const companyData = await fetchCompanyData();

  if (!companyData) {
    return <div>Loading...</div>;
  }

  const formatPhoneNumber = (phone: string | number): string => {
    // Convert number to string if needed
    const phoneStr = phone?.toString().trim();

    // Format phone number as XX XXX XXX
    if (phoneStr?.length === 8) {
      return `${phoneStr.slice(0, 2)} ${phoneStr.slice(2, 5)} ${phoneStr.slice(
        5
      )}`;
    }
    return phoneStr;
  };

  return (
    <div className="w-full h-[40px] flex bg-primary max-lg:hidden justify-center">
        <div className="flex w-[90%] text-white justify-between max-2xl:text-base text-sm">
          <div className="flex gap-2 items-center text-sm max-xl:text-xs">
            <p className="flex gap-2 items-center">
            <span className="font-semibold uppercase tracking-wider"> Address: </span>{companyData.address}, {companyData.zipcode}
              {companyData.addresse?.city}, {companyData.governorate}, Tunisie
            </p>
            <p className="flex gap-2 items-center  px-4">
            <span className="font-semibold uppercase tracking-wider">TELE: </span> +216 {formatPhoneNumber(companyData.phone)}
            </p>
            <p className="flex gap-2 items-center px-4"><span className="font-semibold uppercase tracking-wider">EMAIL: </span>{companyData.email}</p>
          </div>
          <div className="flex w-[200px] gap-4 justify-center items-center px-4">
            {/* Social Media Icons */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="text-white hover:text-blue-500 transition-colors" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-white hover:text-blue-400 transition-colors" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn className="text-white hover:text-blue-600 transition-colors" />
            </a>
          </div>
        </div>
      </div>
  );
};

export default Headertop;
