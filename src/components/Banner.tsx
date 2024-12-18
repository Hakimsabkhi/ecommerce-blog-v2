
import React from 'react';
import Image from 'next/image';


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
export default async function Banner() {
    /* const totalImages = slideData.length;
    const currentSlide = slideData[page - 1]; */
    const companyData = await fetchCompanyData();
    return (
        <div className="relative md:h-[600px] shadow-lg">
            <Image
                className="w-full md:h-full"
                fill
                style={{ objectFit: 'cover' }} 
                alt="banner"
                src={companyData?.imageUrl} // This assumes `pic3` is the image you want to display
                sizes="(max-width: 900px) 400px, 900px"
                loading="eager"
                decoding="async"
            />
        </div>
    );
}
