"use client"
import LoadingSpinner from '@/components/LoadingSpinner';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';


function CreateCompany() {
  const [loading, setLoading] = useState(true);
  const [Idpromotion,setIdpromotion]=useState('');
  const [name, setName] = useState('');
  const [promotionData, setpromotionData] = useState(null);
  const [iconPreviewBanner, setIconPreviewBanner] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const router=useRouter(); 
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file); // Correct state variable for banner
      setIconPreviewBanner(URL.createObjectURL(file));
    }
  };
  const fetchpromotionData =  async () => {
    try {
      const response = await fetch(`/api/promotion/getpromotion`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error('Error fetching company data');
      }
      
      const data = await response.json();
      setpromotionData(data);
      setIdpromotion(data._id || '');
      setName(data.name || '');
      if (data.bannerUrl) {
        setIconPreviewBanner(data.bannerUrl);
      }
    } catch (error) {
      console.error('Error fetching promotion data:', error);
    }finally{
      setLoading(false);
    }
  }
  useEffect(() => {
    // Fetch promotion data
   

    fetchpromotionData();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);

    if (bannerFile) {
      formData.append('banner', bannerFile);
    }
    try {
      const response = await fetch('/api/promotion/postBannerPromotion', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add promotion');
      }

      const data = await response.json();
      fetchpromotionData();
      router.push("/admin/promotionlist/banner");
      console.log('promotion added successfully:', data);
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  const handleUpadte = async (e: React.FormEvent) => {
    e.preventDefault();
 
    const formData = new FormData();
    formData.append('id', Idpromotion);

    formData.append('name', name);
  
    if (bannerFile) {
      formData.append('banner', bannerFile);
    }
    try {
      const response = await fetch('/api/promotion/updateBannerPromotion', {
        method: 'put',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add promotion');
      }

      const data = await response.json();
      fetchpromotionData();
      router.push("/admin/promotionlist/banner");
      console.log('Company added successfully:', data);
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="mx-auto w-[90%] max-xl:w-[90%] py-8 max-lg:pt-20 gap-8">
      <p className="text-3xl font-bold"> {promotionData ? 'Update Promotion' : 'Create Promotion'}</p>
      <form  onSubmit={promotionData ? handleUpadte : handleSubmit}  className="mb-4 mt-4">
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 '>
          <div className="mb-4">
            <p className="block text-sm font-medium">Name Promotion*</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
    
          <div className="mb-4">
            <p className="block text-sm font-medium">Upload Banner*</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="hidden"
              id="upload-banner" // Changed the ID for the banner
            />
            <label
              htmlFor="upload-banner" // Corrected to reference the banner input
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
            >
              Select a Banner
            </label>
            {iconPreviewBanner && (
              <div className="w-[50%]  max-lg:w-full">
                <Image
                  src={iconPreviewBanner}
                  alt="Banner preview"
                  className="w-full h-auto mt-4"
                  width={1000}
                  height={1000}
                />
              </div>
            )}
          </div>
        
        </div>
       
        <div className="flex justify-center items-center gap-4">
     
      <button
            type="button"
            className="bg-gray-400 text-white hover:bg-gray-600 rounded-md w-[30%] h-10"
          >
             <Link href={"/admin/promotionlist/banner"}>
            <p className="text-white"> Cancel</p>
            </Link>
          </button>
          
          <button
            type="submit"
            className="bg-gray-800 text-white hover:bg-gray-600 rounded-md w-[30%] h-10"
          >
            <p className="text-white">  {promotionData ? 'Update Promotion' : 'Create Promotion'}</p>
          </button>
         
        </div>
      </form>
    </div>
  );
}

export default CreateCompany;
