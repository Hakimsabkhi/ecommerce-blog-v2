import Link from 'next/link';
import React from 'react'
interface AfficecostuzecompParam {
    name:string;
    url:string;
  formdata: { title: string; subtitle: string };
  
  
}

export const Afficecostuzecomp: React.FC<AfficecostuzecompParam> = ({ name, formdata,url }) => {
  return (
    <div className="flex flex-col gap-8  mx-auto w-[90%] py-8 ">
    <p className="text-3xl font-bold"> Costmize {name} Title</p>
    
    <Link href={url} className="flex   justify-end">
          <button className="bg-gray-800 hover:bg-gray-600 max-sm:text-sm text-white rounded-lg py-2 px-4">
            {formdata.title ?"update":"create"}
            </button>
          </Link>
          
    <div
      
      className="flex flex-col items-center mx-auto gap-4 w-full lg:w-3/5"
    >
      <div className="flex items-center gap-6 w-full justify-between">
        <p className="text-xl max-lg:text-base font-bold">Title</p>
        <label
      
         
          className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
         
        > {formdata.title}</label>
      </div>
      <div className="flex items-center gap-6 w-full justify-between">
        <p className="text-xl max-lg:text-base font-bold">SubTitle</p>
        <label
      
         
          className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
         
        > {formdata.subtitle}</label>
      </div>
    

    </div>


  </div>
  )
}

export default Afficecostuzecomp