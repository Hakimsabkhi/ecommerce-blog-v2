"use client";

import DeletePopup from "@/components/Popup/DeletePopup";
import React, { useEffect, useMemo, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { DashboardAdmin } from "@/lib/page";
import Pagination from "@/components/Pagination";
import useIs2xl from "@/hooks/useIs2x";

const Page = () => {
  const [roles, setRoles] = useState<
    { _id: string; name: string; access: Record<string, boolean> }[]
  >([]);
  const [newRole, setNewRole] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState({ id: "", name: "" });
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const is2xl = useIs2xl();
  const usersPerPage = is2xl ? 8 : 5;

  const totalPages = useMemo(() => {
    return Math.ceil(roles.length / usersPerPage);
  }, [roles.length, usersPerPage]);

  const handleDeleteClick = (role: {
    _id: string;
    name: string;
    access: Record<string, boolean>;
  }) => {
    setUpdatingRole(role._id);
    setSelectedRole({ id: role._id, name: role.name });
    setIsPopupOpen(true);
  };

  const deleteRole = async (id: string) => {
    try {
      const response = await fetch(`/api/role/deleterolebyid/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      handleClosePopup();
      await fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setUpdatingRole(null);
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/role/getrole");
      if (!res.ok) throw new Error("Failed to fetch roles");
      const data = await res.json();
      setRoles(data.roles);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAccessUpdate = async (
    role: string,
    dashboardSection: string,
    hasAccess: boolean
  ) => {
    setUpdatingRole(`${role}-${dashboardSection}`);
    try {
      const res = await fetch("/api/role/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, dashboardSection, hasAccess }),
      });

      if (!res.ok) throw new Error("Failed to update access");

      setRoles((prevRoles) =>
        prevRoles.map((r) =>
          r.name === role
            ? { ...r, access: { ...r.access, [dashboardSection]: hasAccess } }
            : r
        )
      );
    } catch (err) {
      console.error("Error updating access:", err);
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleAddRole = async () => {
    if (!newRole.trim()) {
      alert("Role name cannot be empty.");
      return;
    }

    try {
      const res = await fetch("/api/role/postrole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newRole }),
      });

      if (!res.ok) throw new Error("Failed to add role");
      const data = await res.json();
      setRoles((prevRoles) => [
        ...prevRoles,
        { name: data.name, access: {}, _id: data._id },
      ]);
      setNewRole("");
    } catch (err) {
      console.error("Error adding role:", err);
    }
  };

  return (
    <div className="mx-auto w-[90%] py-8 flex flex-col gap-8">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold">Roles</h1>
      </div>

      <div className="flex max-sm:flex-col md:items-center max-sm:items-end max-sm:gap-4 gap-8 mt-1">
        <div className="flex gap-4 items-center justify-end">
          <p className="text-xl font-bold">New Role:</p>
          <input
            className="p-2 border border-gray-300 rounded-lg max-sm:w-[50%]"
            placeholder="Add a role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          />
        </div>

        <button
          onClick={handleAddRole}
          type="submit"
          className="bg-gray-800 font-bold hover:bg-gray-600 text-white rounded-lg p-2"
        >
          Add Role
        </button>
      </div>

      <div className="max-2xl:h-80 h-[50vh] overflow-x-auto max-xl:hidden">
        <table className="rounded overflow-hidden w-full table-fixed mx-auto">
          <thead>
            <tr className="bg-gray-800 text-sm">
              <th className="border border-gray-300 p-2">Role Name</th>
              {DashboardAdmin.flatMap((section) =>
                section.items ? section.items.map((item) => item.name) : []
              ).map((name, index) => (
                <th
                  key={index}
                  className="border border-gray-300 px-2 py-2"
                >
                  {name}
                </th>
              ))}
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((role) => (
              <tr key={role._id} className="even:bg-gray-100 odd:bg-white">
                <td className="border border-gray-300 px-2 py-2">
                  {role.name}
                </td>
                {DashboardAdmin.flatMap((section) =>
                  section.items ? section.items.map((item) => item.name) : []
                ).map((dashboardSection) => (
                  <td
                    key={dashboardSection}
                    className="border border-gray-300 px-2 py-2 text-center"
                  >
                    <input
                      type="checkbox"
                      checked={role.access[dashboardSection] || false}
                      onChange={(e) =>
                        handleAccessUpdate(
                          role.name,
                          dashboardSection,
                          e.target.checked
                        )
                      }
                      className="w-6 h-6"
                    />
                  </td>
                ))}
                <td className="border flex justify-center border-gray-300 px-2 py-2">
                  <button
                    onClick={() => handleDeleteClick(role)}
                    className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md"
                    disabled={updatingRole === role._id}
                  >
                    {updatingRole === role._id ? (
                      <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                    ) : (
                      <FaTrashAlt />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {isPopupOpen && (
        <DeletePopup
          handleClosePopup={handleClosePopup}
          Delete={deleteRole}
          id={selectedRole.id}
          name={selectedRole.name}
        />
      )}
    </div>
  );
};

export default Page;
