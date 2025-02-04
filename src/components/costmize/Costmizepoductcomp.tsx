import React from 'react';
import Link from 'next/link';

interface CostmizepoductcompParam {
    name:string;
  handleSubmit: (e: React.FormEvent) => void;
  handleUpdate: (e: React.FormEvent) => void;
  formdata: {  wbtitle:string;
    wbsubtitle:string;
    pctitle:string;
    pcsubtitle:string;
    cptitle:string;
    cpsubtitle:string;};
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
  url:string;
  id:string;
}

export const Costmizepoductcomp: React.FC<CostmizepoductcompParam> = ({ name,handleSubmit,handleUpdate, formdata, handleChange, error,url,id }) => {

  return (
    <div>    <div className="flex flex-col gap-8  mx-auto w-[90%] py-8 ">
    <p className="text-3xl font-bold">{id ? "Update" : "Create"} Costmize {name} Title</p>
    
    <form
      onSubmit={id ? handleUpdate:handleSubmit}
      className="flex flex-col items-center mx-auto gap-4 w-2/3 max-lg:w-full"
    >
      <div className="flex items-center gap-6 w-full justify-between">
        <p className="text-xl max-lg:text-base font-bold">Best Product title*</p>
        <input
          name="wbtitle"
          type="text"
          value={formdata.wbtitle}
          onChange={handleChange}
          className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
          required
        />
      </div>
      <div className="flex items-center gap-6 w-full justify-between">
        <p className="text-xl max-lg:text-base font-bold">Best Product SubTitle*</p>
        <input
          name="wbsubtitle"
          type="text"
          value={formdata.wbsubtitle}
          onChange={handleChange}
          className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
          required
        />
      </div>
      <div className="flex items-center gap-6 w-full justify-between">
        <p className="text-xl max-lg:text-base font-bold">Product Collection Title*</p>
        <input
          name="pctitle"
          type="text"
          value={formdata.pctitle}
          onChange={handleChange}
          className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
          required
        />
      </div>
      <div className="flex items-center gap-6 w-full justify-between">
        <p className="text-xl max-lg:text-base font-bold">Product Collection SubTitle*</p>
        <input
          name="pcsubtitle"
          type="text"
          value={formdata.pcsubtitle}
          onChange={handleChange}
          className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
          required
        />
      </div>
      <div className="flex items-center gap-6 w-full justify-between">
        <p className="text-xl max-lg:text-base font-bold">Product Promotion Title*</p>
        <input
          name="cptitle"
          type="text"
          value={formdata.cptitle}
          onChange={handleChange}
          className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
          required
        />
      </div>
      <div className="flex items-center gap-6 w-full justify-between">
        <p className="text-xl max-lg:text-base font-bold">Product Promotion SubTitle*</p>
        <input
          name="cpsubtitle"
          type="text"
          value={formdata.cpsubtitle}
          onChange={handleChange}
          className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
          required
        />
      </div>
      <div className="flex w-full justify-center gap-4 px-20">
        <Link
        className="w-1/2" href={`${url}`}>
          <button className="w-full  rounded-md border-2 font-light  h-10
           ">
            <p className="font-bold">Cancel</p>
          </button>
        </Link>
        <button
          type="submit"
          className="w-1/2 bg-gray-800 text-white rounded-md  hover:bg-gray-600 h-10"
        >
          <p className="text-white">{id ? "Update" : "Create"} Title</p>
        </button>
      
        
      </div>
    </form>

    {error && <p className="text-red-500">{error}</p>}
  </div></div>
  )
}
