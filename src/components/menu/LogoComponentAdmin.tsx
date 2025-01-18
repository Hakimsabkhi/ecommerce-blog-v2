
import Link from "next/link";
import Image from "next/image";



async function fetchCompanyData() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/websiteinfo/getwebsiteinfo`,
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

const LogoComponentAdmin: React.FC =async () => {
  const companyData = await fetchCompanyData();
  

  return (
    
      <div className="flex w-fit max-lg:w-[50%] gap-4 items-center justify-around">
        <Link href="/" aria-label="Home page " >    
          
       <Image src={companyData.logoUrl} alt={""} width={200} height={200}/>
           
        </Link>       
      </div>
  
  );
};

export default LogoComponentAdmin;
