
import React from 'react';
import Image from 'next/image';
interface BrandData {
    id: string;
    name: string;
    imageUrl: string;
    logoUrl: string;
    place: string;

  }

  
  
  // Function to fetch categories data
  const fetchBrand= async (): Promise<BrandData[]> => {
    try {
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/brand/getAllBrand`, {
        method: 'GET',
        next: { revalidate: 0 }, // Disable caching to always fetch the latest data
      }); // Adjust the API endpoint
      if (!res.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data: BrandData[] = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };
const Brands = async () => {
    const brands = await fetchBrand();
   
    return (
        <div className='desktop max-md:w-[95%] flex flex-col gap-10 max-md:gap-4 py-8'>
          {brands.length>0 &&  <div><div className='flex-col flex gap-2 max-md:gap-1 text-center w-full'>
                <h3 className='font-bold text-4xl text-HomePageTitles'>
                    Shopping by brands
                </h3>
                <p className='text-base text-[#525566]'>Discover lots of products from popular brands</p>
            </div>
            <div className='grid grid-cols-4 w-full max-md:grid-cols-2 group max-xl:grid-cols-3 gap-8 max-md:gap-3'>
                {brands.map((brand, index) => (
                    <div key={index} className=' flex flex-col group cursor-pointer'>
                        <div className='flex gap-4 justify-center rounded-t border-x border-t-2 border-black py-4'>
                            <Image 
                                className='max-xl:w-10 max-xl:h-auto max-lg:w-10 max-lg:h-auto' 
                                src={brand.logoUrl} 
                                alt={brand.name} 
                                width={40} 
                                height={40} 
                            />
                            <div className="flex flex-col gap-2">
                                <p className='text-xl max-xl:text-base max-lg:text-sm font-bold'>{brand.name}</p>
                                <p className='max-xl:text-xs max-lg:text-sm text-sm'>{brand.place}</p>
                            </div>
                        </div>
                        
                        <Image 
                            className='w-full h-auto' 
                            src={brand.imageUrl} 
                            alt={brand.name} 
                            width={300} // Set appropriate width
                            height={200} // Set appropriate height
                            priority={index === 0} // Eagerly load the first image
                        />
                      
                    </div>
                ))}
            </div> </div>}
        </div>
    );
}

export default Brands;
