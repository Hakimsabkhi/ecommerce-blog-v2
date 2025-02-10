export const dynamic = 'force-dynamic'; // Ensure the page is dynamically rendered

import Contactusbanner from '@/components/client/Banner/contactusbanner';
import Milanotorino from '@/components/milanotorino';
import { getWebsiteInfoJSON } from '@/lib/StaticDataHomePage';
import React from 'react';



const Page = async () => {
  const company = await getWebsiteInfoJSON();
  const companyData = JSON.parse(company);
  return (
    <div>
      <Contactusbanner companyData={companyData} />
      <Milanotorino />
    </div>
  );
};

export default Page;
