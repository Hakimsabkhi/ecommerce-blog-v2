"use client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import React, {  useEffect, useState } from "react";

import { CustomizeProduct } from "@/components/Admin/costmize/CustomizeProduct";

const Costmizecatgorey = () => {
  const router = useRouter();
  const [formdata, setFormdata] = useState({
    BestProductTitle:'',
    BestProductSubtitle:'',
    BestProductBanner:'',
    ProductCollectionTitle:'',
    ProductCollectionSubtitle:'',
    ProductCollectionBanner:'',
    ProductPromotionTitle:'',
    ProductPromotionSubtitle:'',
    ProductPromotionBanner:'',
  });
   const name="product"
            const url="/admin/product/"
const [id,setId]=useState('')
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState({
    pcbannerPreview: formdata.ProductCollectionBanner,
    wbbannerPreview: formdata.BestProductBanner,
    cpbannerPreview: formdata.ProductPromotionBanner,
  });
  const [images, setImages] = useState<{
    pcbanner: File | null;
    wbbanner: File | null;
    cpbanner: File | null;
  }>({
    pcbanner: null,
    wbbanner: null,
    cpbanner: null,
  });
  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview((prevState) => ({
        ...prevState,
        [`${fieldName}Preview`]: previewUrl,
      }));
      setImages((prevState) => ({
        ...prevState,
      [`${fieldName}`]: file, // Update the specific field
      }));
      handleChange(e); // Call the handleChange to update the form data
    }
  };
  useEffect(()=>{
  const fetchcostmizeData = async () => {
    try {
      const response = await fetch(`/api/products/admin/costmize/getcostmize`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if(response.status===200){
        const data = await response.json();
      setId(data._id);
      setFormdata(data);
      setImagePreview({
        cpbannerPreview:data.ProductPromotionBanner,
        pcbannerPreview:data.ProductCollectionBanner,
        wbbannerPreview:data.BestProductBanner
      })
      }else if(response.status===404){
        setFormdata( {BestProductTitle:'',
          BestProductSubtitle:'',
          BestProductBanner:'',
          ProductCollectionTitle:'',
          ProductCollectionSubtitle:'',
          ProductCollectionBanner:'',
          ProductPromotionTitle:'',
          ProductPromotionSubtitle:'',
        ProductPromotionBanner:'',
      })
      }

     
    } catch (error) {
      console.error("Error fetching costmize data:", error);
    } 
  };
  fetchcostmizeData()
},[])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
// Check if required fields are empty
if (!formdata.BestProductTitle || !formdata.BestProductSubtitle ||!formdata.ProductCollectionTitle || !formdata.ProductCollectionSubtitle||!formdata.ProductPromotionTitle || !formdata.ProductPromotionSubtitle) {
  setError("Title  are required.");
  return;
}

const formData = new FormData();
    for (const [key, value] of Object.entries(formdata)) {
      formData.append(key, value); // appending the key-value pairs to FormData
    }
    if (images.wbbanner) {
      // Only append to FormData if cpbanner is not null
      formData.append('BestProductBannerFile', images.wbbanner);
    } else {
      // Handle the case when cpbanner is null, if necessary
      console.log('No cpbanner file selected');
    }
    if (images.cpbanner) {
      // Only append to FormData if cpbanner is not null
      formData.append('ProductPromotionBannerFile', images.cpbanner);
    } else {
      // Handle the case when cpbanner is null, if necessary
      console.log('No cpbanner file selected');
    }
    if (images.pcbanner) {
      // Only append to FormData if cpbanner is not null
      formData.append('ProductCollectionBannerFile', images.pcbanner);
    } else {
      // Handle the case when cpbanner is null, if necessary
      console.log('No cpbanner file selected');
    }
    
    try {
      const response = await fetch("/api/products/admin/costmize/postcostmize", {
        method: "POST",
        body: formData,

      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error posting costmize");
      }

      toast.success(`costmize product ${formdata.BestProductTitle} ${formdata.ProductCollectionTitle}${formdata.ProductPromotionTitle}Add successfully!`);
      router.push(url);
    } catch (error: unknown) {
      // Handle different error types effectively
      if (error instanceof Error) {
        console.error("Error deleting costmize:", error.message);
        setError(error.message);
      } else if (typeof error === "string") {
        console.error("String error:", error);
        setError(error);
      } else {
        console.error("Unknown error:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    for (const [key, value] of Object.entries(formdata)) {
      formData.append(key, value); // appending the key-value pairs to FormData
    }
    if (images.wbbanner) {
      // Only append to FormData if cpbanner is not null
      formData.append('BestProductBannerFile', images.wbbanner);
    } else {
      // Handle the case when cpbanner is null, if necessary
      console.log('No cpbanner file selected');
    }
    if (images.cpbanner) {
      // Only append to FormData if cpbanner is not null
      formData.append('ProductPromotionBannerFile', images.cpbanner);
    } else {
      // Handle the case when cpbanner is null, if necessary
      console.log('No cpbanner file selected');
    }
    if (images.pcbanner) {
      // Only append to FormData if cpbanner is not null
      formData.append('ProductCollectionBannerFile', images.pcbanner);
    } else {
      // Handle the case when cpbanner is null, if necessary
      console.log('No cpbanner file selected');
    }
    
    formData.append('id', id);
    try {
      const response = await fetch("/api/products/admin/costmize/updatecostmize", {
        method: "put",
        body: formData,

      });
      if (!response.ok) {
        throw new Error("Failed to update costmize");
      }

      toast.success(`costmize product ${formdata.BestProductTitle} ${formdata.ProductCollectionTitle}${formdata.ProductPromotionTitle}Add successfully!`);

      router.push(url);
     
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };
  return (
    <CustomizeProduct name={name} handleSubmit={handleSubmit }handleUpdate={handleUpdate } formdata={formdata} handleChange={handleChange} error={error} url={url} id={id} handleImageChange={handleImageChange} imagePreview={imagePreview}/>
  );
};

export default Costmizecatgorey;

