import { getstore } from '@/lib/StaticDataHomePage';

import React from 'react'
import Boutique from './showroom/Boutique';



const Boutiquehomepage = async () => {
    const store = await getstore();
      const boutiques=JSON.parse(store)

  return (


    <div className="container mx-auto py-8 ">
       {boutiques  && (
        <div className="flex w-full flex-col gap-2 items-center">
          <h3 className="font-bold text-4xl text-HomePageTitles">
          Nos Boutiques
          </h3>
        </div>
      )}
    <Boutique boutiques={boutiques} />
  </div>
      
  )
}

export default Boutiquehomepage