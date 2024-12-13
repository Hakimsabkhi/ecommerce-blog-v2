import React from 'react';
import Image from 'next/image';
import Link from 'next/link';


interface ChairsPromotionProps {
  promotion?: {
    name: string;
    bannerUrl?: string;
  };
}

const ChairsPromation: React.FC <ChairsPromotionProps>= ({ promotion }) => {




  return (
    
      <div className='relative w-full'>
        <Link 
 href={`/promotion`}
          className='max-2xl:pl-40 max-sm:pl-2 text-xl md:text-4xl lg:text-6xl  text-white transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/4 absolute font-bold'>
          {promotion ? promotion.name : 'Loading...'}
        </Link>
        <div className='w-full h-full flex items-center justify-center  '>        
              <Image
              className='object-cover w-full h-[400px]'
              src={promotion?.bannerUrl || 'default'}
              alt='category logo'
              height={400}
              width={1920}
              priority // This will preload the image
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={75} // Adjust quality for better performance
              placeholder="blur" // Optional: add a placeholder while the image loads
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA" // Optional: base64-encoded low-res image for the placeholder
              />
         
        </div>
      </div>
    
  );
}

export default ChairsPromation;
