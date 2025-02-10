import {  getApprovedStores, getWebsiteInfoJSON } from '@/lib/StaticDataHomePage';
import React from 'react'
import StoreBanner from '../../../components/OurStores/StoreBanner';
  


import AllStore  from '@/components/OurStores/AllStore';
const page = async () => {
    const store = await getApprovedStores();
      const boutiques=JSON.parse(store)
const company = await getWebsiteInfoJSON();
  const companyData = JSON.parse(company);
  return (


 <div>
  <StoreBanner companyData={companyData}/>
  <AllStore   boutiques={boutiques}/>
 </div>
      
  )
}

export default page