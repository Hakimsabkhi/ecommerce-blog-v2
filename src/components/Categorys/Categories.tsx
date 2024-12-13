import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
    id: string;
    name: string;
    imageUrl: string;
    slug:string;
    numberproduct:number;
  }
  
  // Function to fetch categories data
  const fetchCategories = async (): Promise<Category[]> => {
    try {
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/category/getAllCategory`, {
        method: 'GET',
       
        next: { revalidate: 0 }, // Disable caching to always fetch the latest data
      })
      if (!res.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data: Category[] = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  


const Categories: React.FC=  async () => {
    const categories = await fetchCategories();
 

    return (
        <div className='desktop max-md:w-[95%] flex flex-col gap-10 py-8'>
           {categories.length>0 &&  <div><div className='flex-col flex gap-2 items-center w-full max-lg:text-center'>
                <h3 className='font-bold text-4xl text-HomePageTitles'>
                    Our categories
                </h3>
                <p className='text-base text-[#525566]'>Lots of new products and product collections</p>
            </div>
            <div className='gap-4 w-full grid grid-cols-5 max-xl:grid-cols-3 max-lg:grid-cols-3 max-md:grid-cols-2'>
                {categories.map((category, index) => (  
                    <Link className="rounded-full" key={index} href={`/${category.slug}`}>                 
                        <div  className='relative rounded-full w-full group overflow-hidden'>
                            <div className='w-full h-full bg-black/60 absolute rounded-full opacity-0 lg:group-hover:opacity-80 duration-500'></div>
                            <p className='cursor-pointer absolute xl:group-hover:top-32 lg:group-hover:top-12 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black text-lg max-2xl:text-base max-xl:text-base  rounded-3xl max-xl:px-3 w-[85%] text-center py-1 duration-500'>
                                {category.name}
                            </p>
                            <p className='cursor-pointer absolute top-[80%] xl:group-hover:top-44 lg:group-hover:top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-lg max-xl:text-xs opacity-0 lg:group-hover:opacity-100 pt-2 duration-500'>
                              {category.numberproduct}
                            </p>
                            <Image
                                className='w-full rounded-full'
                                src={category.imageUrl}
                                alt={category.name}
                                width={500} // Set appropriate width
                                height={500} // Set appropriate height
                                style={{ objectFit: 'contain' }}
                                priority={index === 0} // Eagerly load the first image
                            />
                        </div>                   
                    </Link>
                ))}
            </div></div>}
        </div>
    );
}

export default Categories;
