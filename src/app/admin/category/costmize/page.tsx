"use client"
import Afficecostuzecomp from '@/components/costmize/Afficecostuzecomp';
import React, { useEffect, useState } from 'react'

const page = () => {
     const [formdata, setFormdata] = useState({
        title:'',
        subtitle:''
      });
      const name="category"
            const url="/admin/category/costmize/edit"
      useEffect(()=>{
        const fetchcostmizeData = async () => {
          try {
            const response = await fetch(`/api/category/admin/costmize/getcostmize`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
           
            if(response.status===200){
              const data = await response.json();
            setFormdata(data)
            }else if(response.status===404){
              setFormdata( {title:'',
                subtitle:''})
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