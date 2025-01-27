"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaMinusSquare } from "react-icons/fa";
import { FaSquarePlus } from "react-icons/fa6";

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
interface close {
  day: string;
  on: boolean;
}
const Form: React.FC = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<FormValues>({
    nom: "",
    image: "",
    phoneNumber: "",
    address: "",
    city: "",
    localisation: "",
    openingHours: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    },
  });
  const [closed, setClosed] = useState<close[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
      reader.readAsDataURL(file); // Convert image to base64
    }
  };

  const handleOpeningHoursChange = (
    day: string,
    index: number,
    timeType: "open" | "close",
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
    updatedOpeningHours[day].push({ open: "", close: "" });

    setFormData((prevData) => ({
      ...prevData,
      openingHours: updatedOpeningHours,
    }));
  };
  const handleMinusTimeSlot = (day: string) => {
    const updatedOpeningHours = { ...formData.openingHours };

    // Remove the last time slot for the specified day if there are any slots
    if (updatedOpeningHours[day].length > 1) {
      updatedOpeningHours[day].pop(); // Remove the last time slot
    }

    setFormData((prevData) => ({
      ...prevData,
      openingHours: updatedOpeningHours,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Validate opening hours for missing close time
    Object.keys(formData.openingHours).forEach((day) => {
      const hours = formData.openingHours[day];

      hours.forEach((hour, index) => {
        if (hour.open && !hour.close) {
          newErrors[
            `${day}-${index}`
          ] = `Error: Missing close time for ${day} `;
        }
      });
    });

    // If errors are found, set the error state
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop the form submission
    }

    // Create a new FormData object
    const formDataObj = new FormData();

    // Append form text data to the FormData object
    formDataObj.append("nom", formData.nom);
    formDataObj.append("phoneNumber", formData.phoneNumber);
    formDataObj.append("address", formData.address);
    formDataObj.append("city", formData.city);
    formDataObj.append("localisation", formData.localisation);

    // Append opening hours
    for (const day in formData.openingHours) {
      if (formData.openingHours[day]) {
        formDataObj.append(
          `${day}`,
          JSON.stringify(formData.openingHours[day])
        );
      }
    }

    // If there's an image, append it as well
    if (formData.image) {
      const imageFile = formData.image.startsWith("data:image")
        ? formData.image
        : null;

      if (imageFile) {
        const byteString = atob(imageFile.split(",")[1]);
        const mimeString = imageFile.split(",")[0].split(":")[1].split(";")[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          uintArray[i] = byteString.charCodeAt(i);
        }
        const file = new Blob([uintArray], { type: mimeString });
        formDataObj.append("image", file, "image.png");
      } else {
        formDataObj.append("image", formData.image);
      }
    }

    // Send the FormData object to the backend API
    try {
      const response = await fetch("/api/store/admin/poststore", {
        method: "POST",
        body: formDataObj, // FormData automatically sets the correct Content-Type (multipart/form-data)
      });

      // Handle the response
      if (response.ok) {
        const result = await response.json();
        console.log("Form submitted successfully:", result);

        // Reset form data
        setFormData({
          nom: "",
          image: "",
          phoneNumber: "",
          address: "",
          city: "",
          localisation: "",
          openingHours: {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: [],
          },
        });

        // Redirect to the store page
        router.push("/admin/store");
      } else {
        console.error("Failed to submit form:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleToggleClose = (day: string, isChecked: boolean) => {
    // Update the openingHours state for the given day
    setFormData((prevFormData) => {
      const updatedOpeningHours = { ...prevFormData.openingHours };

      // If the checkbox is checked (closed), set the hours to null or empty
      if (!isChecked) {
        updatedOpeningHours[day] = updatedOpeningHours[day].map((hour) => ({
          ...hour,
          open: "", // Clear the open time
          close: "", // Clear the close time
        }));
        setClosed((prevClosed) => [
          ...prevClosed.filter((item) => item.day !== day), // Remove previous closure if exists
          { day, on: false }, // Mark the day as closed
        ]);

        updatedOpeningHours[day] = []; // Clear the opening hours for the specific day

        setFormData((prevData) => ({
          ...prevData,
          openingHours: updatedOpeningHours,
        }));
      } else {
        setClosed((prevClosed) => [
          ...prevClosed.filter((item) => item.day !== day), // Remove previous closure if exists
          { day, on: true }, // Mark the day as closed
        ]);
        const updatedOpeningHours = { ...formData.openingHours };
        updatedOpeningHours[day] = [
          ...updatedOpeningHours[day],
          { open: "", close: "" },
        ];

        setFormData((prevData) => ({
          ...prevData,
          openingHours: updatedOpeningHours,
        }));
      }
      return {
        ...prevFormData,
        openingHours: updatedOpeningHours,
      };
    });
  };

  return (
    <div className="relative w-[80%] h-full mx-auto my-[20px] flex flex-col">
      <h1 className="text-3xl font-bold pb-6">Create Boutique</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <p className="max-lg:text-base font-bold mb-2">Upload Image*</p>
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
              <Image
                src={formData.image}
                alt="Preview"
                className="w-full h-auto rounded-md"
                width={500}
                height={500}
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="nom"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="localisation"
              className="block text-sm font-medium text-gray-700"
            >
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
        </div>
        <h3 className="text-lg font-medium text-gray-900">Opening Hours</h3>

          <div className="grid grid-cols-3 max-md:grid-cols-1 max-lg:grid-cols-2 gap-y-8 gap-4">
        {Object.keys(formData.openingHours).map((day) => (
          <div key={day} className=" ">
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                {day}
              </label>
              <div className="flex items-center ">
                <span className="mr-3 text-sm font-medium text-gray-600 ">
                  Close
                </span>
                <label className="relative flex items-center  cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    onChange={(e) => handleToggleClose(day, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0  rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700 "></div>
                </label>
                <span className="ml-3 text-sm font-medium text-gray-600 ">
                  Open
                </span>
              </div>

              <div className="">
                {formData.openingHours[day].map((hour, index) => (
                  <div key={index} className="">
                    <div className="flex gap-2">
                      <div className=" w-2/5">
                        <label className="block text-sm font-medium text-gray-700">
                          Open
                        </label>
                        <input
                          type="time"
                          value={hour.open}
                          onChange={(e) =>
                            handleOpeningHoursChange(
                              day,
                              index,
                              "open",
                              e.target.value
                            )
                          }
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                        {errors[`${day}-${index}`] && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors[`${day}-${index}`]}
                          </div>
                        )}
                      </div>
                      <div className=" w-2/5 ">
                        <label className="block text-sm font-medium text-gray-700">
                          Close
                        </label>
                        <input
                          type="time"
                          value={hour.close}
                          onChange={(e) =>
                            handleOpeningHoursChange(
                              day,
                              index,
                              "close",
                              e.target.value
                            )
                          }
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                          disabled={!hour.open} // Disable the close field if open is empty
                        />
                      </div>
                      {closed.some((item) => item.day === day && item.on) && (
                        <div className="flex gap-1 mt-2">
                          <button
                            type="button"
                            onClick={() => handleMinusTimeSlot(day)}
                            className="text-gray-600 hover:underline mt-2 "
                          >
                            <FaMinusSquare size={20} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddTimeSlot(day)}
                            className="text-gray-600 hover:underline mt-2 "
                          >
                            <FaSquarePlus size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                    {/* Display error message inside the Close div if exists */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}</div>

        <div className="flex flex-col gap-4 pt-4">
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none"
          >
            Submit
          </button>
          <Link
            href={"/admin/store"}
            className="flex justify-center bg-gray-600 hover:bg-gray-500 py-2 px-4 rounded-md focus:outline-none"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Form;
