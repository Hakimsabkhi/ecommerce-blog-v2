// app/banner/page.tsx
import React from 'react';
import Image from 'next/image';
import connectToDatabase from '@/lib/db';
import Company from '@/models/Websiteinfo';

export const revalidate = 60; 

async function getCompanyData() {
  await connectToDatabase();
  const company = await Company.findOne({}).exec();
  return company;
}

export default async function Banner() {
  const companyData = await getCompanyData();

  return (
    <div className="relative md:h-[600px] shadow-lg">
      <Image
        className="w-full md:h-full"
        fill
        style={{ objectFit: 'cover' }}
        alt="banner"
        src={companyData?.imageUrl || '/fallback.jpg'}
        sizes="(max-width: 900px) 400px, 900px"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
