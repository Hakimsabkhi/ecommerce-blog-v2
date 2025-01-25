"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FaSquarePlus } from 'react-icons/fa6';

interface OpeningHour {
  open: string;
  close: string;
}

interface FormValues {
  nom: string;
  image: string;
  phoneNumber: string;
  address: string;
  city: string;
  localisation: string;
  openingHours: {
    [day: string]: OpeningHour[];
  };
}

const Form: React.FC = () => {
    const params = useParams() as { id: string };
    const router = useRouter();
     const [imgPatentes, setImgPatentes] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormValues>({
    nom: '',
    image: '',
    phoneNumber: '',
    address: '',
    city: '',
    localisation: '',
    openingHours: {
      Monday: [{ open: '', close: '' }],
      Tuesday: [{ open: '', close: '' }],
      Wednesday: [{ open: '', close: '' }],
      Thursday: [{ open: '', close: '' }],
      Friday: [{ open: '', close: '' }],
      Saturday: [{ open: '', close: '' }],
      Sunday: [{ open: '', close: '' }],
    },
  });

  useEffect(() => {
    if (params.id) {
      // Fetch store data by ID when the component is mounted
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/store/admin/getstore/${params.id}`);
          const data = await response.json();
          if (response.ok) {
            setFormData({
              nom: data.nom,
              image: data.image,
              phoneNumber: data.phoneNumber,
              address: data.address,
              city: data.city,
              localisation: data.localisation,
              openingHours: data.openingHours||{
                Monday: [{ open: '', close: '' },{ open: '', close: '' }],
              Tuesday: [{ open: '', close: '' },{ open: '', close: '' }],
              Wednesday:[{ open: '', close: '' },{ open: '', close: '' }],
              Thursday: [{ open: '', close: '' },{ open: '', close: '' }],
              Friday: [{ open: '', close: '' },{ open: '', close: '' }],
              Saturday: [{ open: '', close: '' },{ open: '', close: '' }],
              Sunday: [{ open: '', close: '' },{ open: '', close: '' }],
              },
            });
          } else {
            console.error('Failed to fetch store data');
          }
        } catch (error) {
          console.error('Error fetching store data:', error);
        }
      };
      fetchData();
    }
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (e.target.files) {
      setImgPatentes(e.target.files[0]);
  
  }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setFormData((prevData) => ({
            ...prevData,
            image: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpeningHoursChange = (
    day: string,
    index: number,
    timeType: 'open' | 'close',
    value: string
  ) => {
    const updatedOpeningHours = { ...formData.openingHours };
    updatedOpeningHours[day][index][timeType] = value;

    setFormData((prevData) => ({
      ...prevData,
      openingHours: updatedOpeningHours,
    }));
  };
  const handleAddTimeSlot = (day: string) => {
    const updatedOpeningHours = { ...formData.openingHours };
    updatedOpeningHours[day].push({ open: '', close: '' });

    setFormData((prevData) => ({
      ...prevData,
      openingHours: updatedOpeningHours,
    }));
  };


  const handleupdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create a new FormData object
    const formDataObj = new FormData();

    formDataObj.append('nom', formData.nom);
    formDataObj.append('phoneNumber', formData.phoneNumber);
    formDataObj.append('address', formData.address);
    formDataObj.append('city', formData.city);
    formDataObj.append('localisation', formData.localisation);

    // Append opening hours
    for (const day in formData.openingHours) {
      formDataObj.append(`${day}`, JSON.stringify(formData.openingHours[day]));
    }

    // Append the image if available
    if (imgPatentes) {
      formDataObj.append('image', imgPatentes); // imgPatentes is of type File
    }
    

    // Send the FormData object to the backend API
    try {
      const response = await fetch(`/api/store/admin/updatestore/${params.id}`, {
        method: 'PUT' ,  // PUT for updating, POST for creating new
        body: formDataObj,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Form submitted successfully:', result);
        setFormData({
          nom: '',
          image: '',
          phoneNumber: '',
          address: '',
          city: '',
          localisation: '',
          openingHours: {
            Monday: [{ open: '', close: '' },{ open: '', close: '' }],
            Tuesday: [{ open: '', close: '' },{ open: '', close: '' }],
            Wednesday:[{ open: '', close: '' },{ open: '', close: '' }],
            Thursday: [{ open: '', close: '' },{ open: '', close: '' }],
            Friday: [{ open: '', close: '' },{ open: '', close: '' }],
            Saturday: [{ open: '', close: '' },{ open: '', close: '' }],
            Sunday: [{ open: '', close: '' },{ open: '', close: '' }],
          },
        });
        router.push('/admin/store');
      } else {
        console.error('Failed to submit form:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      console.error('An error occurred. Please try again later.');
    }
  }; 

  return (
    <div className="relative w-[80%] h-full mx-auto my-[20px] flex flex-col">
      <h1 className="text-3xl font-bold pb-6">Edit Boutique</h1>
      <form  onSubmit={handleupdate} >
         <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    value={formData.nom}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
        
                <div>
                  <p className="max-lg:text-base font-bold">Upload Image*</p>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:bg-gray-50 file:text-gray-700"
                  />
                  {formData.image && (
                    <div className="mt-4">
                      <Image src={formData.image} alt="Preview" className="w-full h-auto rounded-md" width={500} height={500} />
                    </div>
                  )}
                </div>
        
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
        
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
        
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
        
                <div>
                  <label htmlFor="localisation" className="block text-sm font-medium text-gray-700">
                    Localisation
                  </label>
                  <input
                    id="localisation"
                    name="localisation"
                    type="text"
                    value={formData.localisation}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
        
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Opening Hours</h3>
                  {Object.keys(formData.openingHours).map((day) => (
                    <div key={day} className='relative'>
                      <label className="block text-sm font-medium text-gray-700">{day}</label>
                      {formData.openingHours[day].map((hour, index) => (
                        <div key={index} className="flex space-x-4">
                          <div className='flex flex-col w-[48%]'>
                            <label className="block text-sm font-medium text-gray-700">Open</label>
                          <input
                            type="time"
                            value={hour.open}
                            onChange={(e) => handleOpeningHoursChange(day, index, 'open', e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                          />
                          </div>
                          <div className='flex flex-col w-[48%]'>
                          <label className="block text-sm font-medium text-gray-700">Close</label>
                          <input
                            type="time"
                            value={hour.close}
                            onChange={(e) => handleOpeningHoursChange(day, index, 'close', e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                            disabled={!hour.open} // Disable the close field if open is empty
                          />
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddTimeSlot(day)}
                        className="text-gray-600 hover:underline mt-2 absolute right-0 bottom-3"
                      >
                       <FaSquarePlus size={20} />
                      </button>
                    </div>
                  ))}
                </div>
        <div className="flex flex-col gap-4 pt-4">
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none"
          >
            Update 
          </button>
          <Link href={'/admin/store'} className="flex justify-center bg-gray-600 hover:bg-gray-500 py-2 px-4 rounded-md focus:outline-none">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Form;
