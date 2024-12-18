import React from 'react';
import { IPromotion } from '@/models/Promotion';
import { notFound } from 'next/navigation';
import ChairsPromation from '@/components/promotioncomp/promotionf/ChairsPromotion';
import ProductPromotion from '@/components/promotioncomp/promotionf/ProductPromotion';


// Fetch category data by ID
const fetchpromotionData = async () => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/promotion/getpromotion/`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
    });

    console.log(res);

    if (!res.ok) {
      console.log('Promotion not found');
      return notFound();
    }

    const data: IPromotion = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching promotion data:', error);
    return notFound();
  }
};



// HomePage component
async function promotionPage() {

  const promotion = await fetchpromotionData();
  
  if (!promotion ) {
    return notFound();
  } 

  return (
    <div>
      {/* Uncomment the following if you need to show a banner */}
      <ChairsPromation promotion={promotion} />
      <ProductPromotion/> 
    </div>
  );
}

// Export the HomePage component at the end
export default promotionPage;
