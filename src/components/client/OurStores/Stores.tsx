import { getApprovedStores } from '@/lib/StaticDataHomePage';

import React from 'react'
import BoutiqueCarousel from './BoutiqueCarousel';



const Stores = async () => {
    const store = await getApprovedStores();
      const boutiques=JSON.parse(store)

  return (


    <div className=" w-[95%] mx-auto py-8">
       {boutiques  && (
        <div className="flex w-full flex-col gap-2 items-center">
          <h3 className="font-bold text-4xl text-HomePageTitles">
          Nos Boutiques
          </h3>
        </div>
      )}
    <BoutiqueCarousel boutiques={boutiques} />
  </div>
      
  )
}

export default Stores