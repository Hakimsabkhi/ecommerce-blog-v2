import {  getApprovedStores, getWebsiteInfoJSON } from '@/lib/StaticDataHomePage';
import React from 'react'
import Showroombanner from './../../../components/showroom/showroombanner';
  


import Boutique from '@/components/showroom/Boutique';
const page = async () => {
    const store = await getApprovedStores();
      const boutiques=JSON.parse(store)
const company = await getWebsiteInfoJSON();
  const companyData = JSON.parse(company);
  return (


 <div>
  <Showroombanner companyData={companyData}/>
  <Boutique boutiques={boutiques}/>
 </div>
      
  )
}

export default page