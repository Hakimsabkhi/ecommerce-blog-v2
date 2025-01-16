"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaRegEdit, FaSpinner, FaTrashAlt } from "react-icons/fa";
import DeletePopup from "@/components/Popup/DeletePopup";
import Pagination from "@/components/Pagination";
import useIs2xl from "@/hooks/useIs2x";

type User = {
  _id: string;
  username: string;
};

type Companies = {
  _id: string;
  name: string;
  matriculefiscal: string;
  address: string;
  numtele: string;
  gerantsoc: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
};

const Page = () => {
  const [companies, setCompanies] = useState<Companies[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Companies[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<{ id: string; name: string }>({ id: "", name: "" });
  const [loadingCompanyId, setLoadingCompanyId] = useState<string | null>(null);

  const is2xl = useIs2xl();
  const CompaniesPerPage = is2xl ? 8 : 5;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`/api/companies/admin/getcompanies`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Companies[] = await response.json();
        setCompanies(data);
        setFilteredCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const filtered = companies.filter((company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(filtered);
    setCurrentPage(1);
  }, [searchTerm, companies]);

  const handleDeleteClick = (company: Companies) => {
    setSelectedCompany({ id: company._id, name: company.name });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingCompanyId(null);
  };

  const deleteCompany = async (id: string) => {
    try {
      setLoadingCompanyId(id);
      const response = await fetch(`/api/companies/admin/deletecompanies/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setCompanies(companies.filter((company) => company._id !== id));
      handleClosePopup();
    } catch (error) {
      console.error("Error deleting company:", error);
    } finally {
      setLoadingCompanyId(null);
    }
  };

  const indexOfLastCompany = currentPage * CompaniesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - CompaniesPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);
  const totalPages = Math.ceil(filteredCompanies.length / CompaniesPerPage);

  return (
    <div className="mx-auto w-[90%] py-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold">All Enterprises</p>
        <Link href="/admin/companies/addcompanies">
          <button className="bg-gray-800 font-bold hover:bg-gray-600 text-white rounded-lg p-2">
            Add a New Enterprise
          </button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search Enterprise"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border border-gray-300 rounded-lg max-w-max"
      />

      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <FaSpinner className="animate-spin text-2xl" />
        </div>
      ) : (
        <div className='max-2xl:h-80 h-[50vh] max-md:hidden'>
        <table className="w-full rounded overflow-hidden table-fixed">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-4 py-3">Matricule Fiscale</th>
              <th className="px-4 py-3">Enterprise Name</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Manager</th>
              <th className="px-4 py-3">Created By</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCompanies.map((company) => (
              <tr key={company._id} className="even:bg-gray-100 odd:bg-white">
                <td className="border px-4 py-3">{company.matriculefiscal}</td>
                <td className="border px-4 py-3 truncate">{company.name}</td>
                <td className="border px-4 py-3">{company.address}</td>
                <td className="border px-4 py-3">{company.gerantsoc}</td>
                <td className="border px-4 py-3">{company.user?.username}</td>
                <td className="border px-4 py-3 text-center">
                  <Link href={`/admin/companies/${company._id}`}>
                    <button aria-label="Edit Company" className="bg-gray-800 text-white p-2 hover:bg-gray-600 rounded-md">
                      <FaRegEdit />
                    </button>
                  </Link>
                  <button
                    aria-label="Delete Company"
                    className="bg-gray-800 text-white p-2 hover:bg-gray-600 rounded-md ml-2"
                    onClick={() => handleDeleteClick(company)}
                  >
                    {loadingCompanyId === company._id ? "Processing..." : <FaTrashAlt />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}

      {isPopupOpen && (
        <DeletePopup
          handleClosePopup={handleClosePopup}
          Delete={deleteCompany}
          id={selectedCompany.id}
          name={selectedCompany.name}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
        <div className="md:hidden flex flex-col gap-4">
          {currentCompanies.map((item) => (
            <div key={item._id} 
            className="p-4 mb-4 flex flex-col gap-4 bg-gray-100 rounded shadow-md">
              <div className="">
                
                <div>
                <div className="flex gap-1 text-3xl font-semibold uppercase text-center justify-center ">
                  <p className="text-gray-600 ">Matricule Fiscale:</p>
                  <p>{item.matriculefiscal}</p>
                </div>
                <hr className="border-white border-2 w-full my-2" />
                <div className="flex  gap-1 font-semibold pl-[15%]">
                  <p className="text-gray-600 w-1/3 mr-4">Nom Enterprise:</p>
                  <p className="truncate">{item.name}</p>
                </div>
                <div className="flex gap-1 font-semibold pl-[15%]">
                  <p className="text-gray-600  w-1/3 mr-4">Created by:</p>
                  <p>{item?.user?.username}</p>
                </div>
                </div>
                <div className="flex gap-1 font-semibold pl-[15%]">
                <p className="text-gray-600  w-1/3 mr-4">Gerant Enterprise:</p>
                <p>{item.gerantsoc}</p></div>
              </div>
              <div className="flex justify-center gap-4 mt-4">
              <Link href={`/admin/companies/${item._id}`}>
                  <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                    <FaRegEdit />
                  </button>
                </Link>
                <button
                  onClick={() => handleDeleteClick(item)}
                  className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md"
                >
                  {loadingCompanyId === item._id ? "Processing..." : <FaTrashAlt />}
                </button>
                 {isPopupOpen && (
                  <DeletePopup
                    handleClosePopup={handleClosePopup}
                    Delete={deleteCompany}
                    id={selectedCompany.id}
                    name={selectedCompany.name}
                  />
                )} 
              </div>
            </div>
          ))}
        </div>
      

     
    </div>
  );
};

export default Page;
