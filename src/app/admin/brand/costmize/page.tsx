"use client"
import Afficecostuzecomp from '@/components/costmize/Afficecostuzecomp';
import React, { useEffect, useState } from 'react'

const page = () => {
     const [formdata, setFormdata] = useState({
        title:'',
        subtitle:''
      });
      const name="category"
            const url="/admin/brand/costmize/edit"
      useEffect(()=>{
        const fetchcostmizeData = async () => {
          try {
            const response = await fetch(`/api/brand/admin/costmize/getcostmize`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (!response.ok) {
              throw new Error("Error fetching costmizebrand data");
            }
            if(response.status==200){
            const data = await response.json();
           console.log(data)
            setFormdata(data)
            }
          } catch (error) {
            console.error("Error fetching costmize data:", error);
          } 
        };
        fetchcostmizeData()
      },[])
  return (
    <Afficecostuzecomp name={name} url={url} formdata={formdata}/>
  )
}

export default page