import React from 'react';
import { notFound } from 'next/navigation';
import ChairsPromation from '@/components/promotioncomp/promotionf/ChairsPromotion';
import ProductPromotion from '@/components/promotioncomp/promotionf/ProductPromotion';
import { promotionData } from '@/lib/pagefunction';






// HomePage component
async function promotionPage() {

  const promotion = await promotionData();
  
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
