import {  getstores } from '@/lib/StaticDataHomePage';
import Image from 'next/image'
import React from 'react'
import { BsFillTelephoneFill } from 'react-icons/bs';
import {  FaMapMarkerAlt } from 'react-icons/fa';
interface OpeningHours {
    [day: string]: { open: string; close: string }[]; 
  }
  
  interface StoreData {
    _id: string;
    nom: string;
    image: string;
    phoneNumber: string;
    address: string;
    city: string;
    localisation: string;
    openingHours: OpeningHours;
  }
const Boutique = async () => {
    const store = await getstores();
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
   
      {/* Repeated block */}
      {boutiques.map((item:StoreData) => (
        <div
          key={item._id}
          className="bg-white shadow-lg  overflow-hidden"
        >
           
        {item.image && <Image
            src={item.image} // Replace with your image path
            alt="Store Image"
            width={1920}
            height={1080}
            className="w-full object-cover h-96"
          />}
         
          <div className="p-6">
            <h2 className="text-center text-lg font-bold uppercase mb-4">
             {item.nom}
            </h2>
            <div className="text-center text-black flex justify-center items-center gap-4">
              <div className='flex flex-col-1 justify-center items-center'>
                <span className="inline-block bg-black p-1 font-semibold mr-2 rounded-md ">
                <BsFillTelephoneFill  className='text-white' size={15}/>

                </span>
                <span  className='font-bold'> {item.phoneNumber}</span>
              </div>
              <div className='flex flex-col-1 justify-center items-center'>
                <span className="inline-block text-black font-semibold mr-2">
                  <FaMapMarkerAlt size={23}/>
                </span>
                <span className='font-bold'>{item.address} {item.city}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col-1 justify-center gap-3">
              <h3 className="text-center text-black font-bold mb-2">
                TEMPS OUVERT :
              </h3>
              <ul className="text-center text-sm space-y-1  mt-1 ">
              {item?.openingHours &&
  Object.entries(item.openingHours).map(([day, hours]) => (
    <li key={day}>
      <span className="font-medium">{day}:</span>{" "}
      {Array.isArray(hours) && hours.length > 0
  ? hours.map((hour) => {
      const openTime = hour.open || "";  // Fallback to "-" if open is invalid
      const closeTime = hour.close || "";   // Fallback to "-" if close is invalid
      if (!openTime && !closeTime)return ''
      return `${openTime} - ${closeTime}`;
    }).filter(Boolean) // Remove any null or empty entries from the array
    .join("/ ") || "Closed" // If the array is empty after filtering, display "Closed"
: "Closed"}

      
    </li>
    ))}


              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
      
  )
}

export default Boutique