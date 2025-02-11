import Link from 'next/link'
import React from 'react'

const Headerbottonright = () => {
  return (
    
        
          <div className="flex w-[60%] justify-end gap-8 font-semibold items-center text-white text-sm tracking-wider max-xl:text-base max-lg:text-xs max-md:hidden">
            <Link className="hover:text-secondary" href="/promotion">
              PROMOTION
            </Link>
            <Link className="hover:text-secondary" href="/bestproducts">
            MEILLEURS PRODUITS
            </Link>
            <Link className="hover:text-secondary" href="/bestcollection">
            MEILLEURE COLLECTION
            </Link>
            <Link className="hover:text-secondary" href="/ourstores">
              NOS BOUTIQUES
            </Link>
            <Link className="hover:text-secondary" href="/blog">
              BLOG
            </Link>
            <Link className="hover:text-secondary" href="/contactus">
            CONTACTEZ-NOUS
            </Link>
          </div>
  )
}

export default Headerbottonright