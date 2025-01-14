"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import DeletePopup from "../Popup/DeletePopup";
import ConfirmPopup from "../Popup/ConfirmPopup";
import { FaSpinner, FaTrashAlt, FaRegEye, FaRegEdit } from "react-icons/fa";
import Pagination from "../Pagination";
import useIs2xl from "@/hooks/useIs2x";
type User = {
  _id: string;
  username: string;
  // other user fields
};

interface Address {
  _id: string;
  governorate: string;
  city: string;
  zipcode: string;
  address: string;
}

interface Order {
  _id: string;
  user: User;
  ref: string;
  address: Address;
  paymentMethod: string;
  deliveryMethod: string;
  createdAt: string;
  total: number;
  orderStatus: string;
  statusinvoice: boolean;
}

const ListOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]); // All orders
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]); // Filtered orders
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const is2xl = useIs2xl();
  const ordersPerPage = is2xl ? 8 : 5;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState({ id: "", name: "" });
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState(""); // Initial value
  const [timeframe, setTimeframe] = useState<"year" | "month" | "day">("month");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isPopupOpeninvoice, setIsPopupOpeninvoice] = useState(false);
  const [selectedorderid, setSelectedorderid] = useState<string>("");
  const [selectedval, setSelectedval] = useState<string>("");
  const [colSpan, setColSpan] = useState(5);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    console.log(e.target.value); // Do something with the selected value (e.g., filter data)
  };
  const handleDeleteClick = (order: Order) => {
    setLoadingOrderId(order._id);

    setSelectedOrder({ id: order._id, name: order.ref });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingOrderId(null);
  };
  const handleClosePopupinvoice = () => {
    setIsPopupOpeninvoice(false);
  };
  const handleinvoice = async (order: string) => {
    try {
      const response = await fetch(`/api/invoice/postinvoice`, {
        method: "POST",

        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      window.open(`/admin/invoice/${data.ref._id}`, "_blank");
      setIsPopupOpeninvoice(false);
    } catch (error: unknown) {
      // Handle different error types effectively
      if (error instanceof Error) {
        console.error("Error deleting category:", error.message);
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
  const DeleteOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/order/admin/deleteorderbyid/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      handleClosePopup();
      toast.success("order delete successfully!");

      await getOrders();
    } catch (error: unknown) {
      // Handle different error types effectively
      if (error instanceof Error) {
        console.error("Error deleting category:", error.message);
        setError(error.message);
      } else if (typeof error === "string") {
        console.error("String error:", error);
        setError(error);
      } else {
        console.error("Unknown error:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoadingOrderId(null);
    }
  };
  const getOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/order/admin/getallorder", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data); // Store all orders
      setFilteredOrders(data); // Initially, filteredOrders are the same as orders
    } catch (error: unknown) {
      // Handle different error types effectively
      if (error instanceof Error) {
        console.error("Error deleting category:", error.message);
        setError(error.message);
      } else if (typeof error === "string") {
        console.error("String error:", error);
        setError(error);
      } else {
        console.error("Unknown error:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);
  const handleinvoiceconfirm = async (orderId: string, newStatus: string) => {
    try {
      const updateFormData = new FormData();
      updateFormData.append("vadmin", newStatus);
      const response = await fetch(
        `/api/order/admin/updatestatusinvoice/${orderId}`,
        {
          method: "PUT",
          body: updateFormData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setOrders((prevData) =>
        prevData.map((item) =>
          item._id === orderId
            ? { ...item, statusinvoice: JSON.parse(newStatus) }
            : item
        )
      );
      handleinvoice(orderId);
      const data = await response.json();
      console.log("Order status updated successfully:", data);
    } catch (error) {
      console.error("Failed to update Order status:", error);
      toast.error("Failed to update Order status");
    }
  };
  const updatestatusinvoice = async (orderId: string, newStatus: string) => {
    if (newStatus == "false") {
      try {
        const updateFormData = new FormData();
        updateFormData.append("vadmin", newStatus);
        const response = await fetch(
          `/api/order/admin/updatestatusinvoice/${orderId}`,
          {
            method: "PUT",
            body: updateFormData,
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        setOrders((prevData) =>
          prevData.map((item) =>
            item._id === orderId
              ? { ...item, statusinvoice: JSON.parse(newStatus) }
              : item
          )
        );
        const data = await response.json();
        console.log("Order status updated successfully:", data);
      } catch (error) {
        console.error("Failed to update Order status:", error);
        toast.error("Failed to update Order status");
      }
    } else {
      setIsPopupOpeninvoice(true);
      setSelectedorderid(orderId);
      setSelectedval(newStatus);
    }
  };
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setLoadingOrderId(orderId);
    try {
      const updateFormData = new FormData();
      updateFormData.append("status", newStatus);

      const response = await fetch(
        `/api/order/admin/updateStatusorder/${orderId}`,
        {
          method: "PUT",
          body: updateFormData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Order status updated successfully:", data);

      getOrders(); // Refresh the orders
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setLoadingOrderId(null);
    }
  };

  useEffect(() => {
    const updateColSpan = () => {
      const isSmallScreen = window.innerWidth <= 768; // max-md
      const isMediumScreen = window.innerWidth <= 1024; // max-lg

      if (isSmallScreen) {
        setColSpan(3); // max-md: colSpan = 4
      } else if (isMediumScreen) {
        setColSpan(4); // max-lg: colSpan = 5
      } else {
        setColSpan(5); // Default: colSpan = 6
      }
    };

    // Initial check
    updateColSpan();

    // Add event listener
    window.addEventListener("resize", updateColSpan);

    // Cleanup event listener
    return () => window.removeEventListener("resize", updateColSpan);
  }, []);
  useEffect(() => {
    getOrders();
  }, [getOrders]);

  useEffect(() => {
    // Apply search and status filter
    const filtered = orders.filter((order) => {
      const matchesSearch =
        order.ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.username.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = status === "" || order.orderStatus === status;

      // Apply date filtering based on the selected timeframe
      const matchesDateFilter = (date: string) => {
        const orderDate = new Date(order.createdAt);
        const selectedDateObj = new Date(date);

        if (timeframe === "year") {
          return orderDate.getFullYear() === selectedDateObj.getFullYear();
        } else if (timeframe === "month") {
          return (
            orderDate.getFullYear() === selectedDateObj.getFullYear() &&
            orderDate.getMonth() === selectedDateObj.getMonth()
          );
        } else if (timeframe === "day") {
          return (
            orderDate.getFullYear() === selectedDateObj.getFullYear() &&
            orderDate.getMonth() === selectedDateObj.getMonth() &&
            orderDate.getDate() === selectedDateObj.getDate()
          );
        }
        return true; // No filter if no timeframe is selected
      };

      return matchesSearch && matchesStatus && matchesDateFilter(selectedDate);
    });

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to the first page
  }, [searchTerm, status, orders, timeframe, selectedDate]);

  useEffect(() => {
    // Set default selectedDate when the component is mounted
    const currentDate = new Date();
    if (timeframe === "year") {
      setSelectedDate(`${currentDate.getFullYear()}-01-01`);
    } else if (timeframe === "month") {
      setSelectedDate(
        `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-01`
      );
    } else if (timeframe === "day") {
      setSelectedDate(currentDate.toISOString().split("T")[0]); // Current date in YYYY-MM-DD format
    }
  }, [timeframe]);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mx-auto w-[90%] py-8 flex flex-col gap-8">
      <div className="flex justify-between">
        <p className="text-3xl font-bold">ALL Orders</p>
        <Link
          href={"order/addorder"}
          className="bg-gray-800 font-bold hover:bg-gray-600 text-white rounded-lg p-2"
        >
          <button type="button">create order</button>
        </Link>
      </div>

      <div className="flex max-lg:flex-col max-lg:gap-4 justify-between">
        <input
          type="text"
          placeholder="Search orders"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg md:max-xl:w-[30%] lg:w-1/5"
        />

        <select
          name="category"
          value={status}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg md:max-xl:w-[30%] lg:w-1/5 h-10 block"
          required
        >
          <option value="">All</option>
          <option value="Processing">En cours de traitement</option>
          <option value="Pack">Expédiée</option>
          <option value="Deliver">Livrée</option>
          <option value="Cancelled">Annulée</option>
          <option value="Refunded">Remboursée</option>
        </select>

        <div className="flex justify-between md:w-[70%] lg:w-[50%] xl:w-[40%]  ">
          <button
            onClick={() => setTimeframe("year")}
            className={`p-2 rounded ${
              timeframe === "year"
                ? "bg-gray-800 text-white"
                : "bg-gray-300 text-white"
            }`}
          >
            Par Année
          </button>
          <button
            onClick={() => setTimeframe("month")}
            className={`p-2 rounded ${
              timeframe === "month"
                ? "bg-gray-800 text-white"
                : "bg-gray-300 text-white"
            }`}
          >
            Par Mois
          </button>
          <button
            onClick={() => setTimeframe("day")}
            className={`p-2 md:mr-8 rounded ${
              timeframe === "day"
                ? "bg-gray-800 text-white"
                : "bg-gray-300 text-white"
            }`}
          >
            Par Jour
          </button>
          <input
            type={
              timeframe === "year"
                ? "number"
                : timeframe === "month"
                ? "month"
                : "date"
            }
            className="border rounded-lg p-2 w-36"
            value={
              timeframe === "year"
                ? selectedDate.split("-")[0]
                : timeframe === "month"
                ? selectedDate.slice(0, 7)
                : selectedDate
            }
            onChange={(e) => {
              if (timeframe === "year") {
                setSelectedDate(`${e.target.value}-01-01`);
              } else if (timeframe === "month") {
                setSelectedDate(e.target.value);
              } else {
                setSelectedDate(e.target.value);
              }
            }}
          />
        </div>
      </div>
      <div className="max-2xl:h-80 h-[50vh] max-md:hidden">
        <table className="w-full rounded overflow-hidden table-fixed ">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-3 w-[12%] lg:max-xl:w-[13%] md:w-[15%]">
                REF
              </th>
              <th className="px-4 py-3 w-[15%] max-xl:hidden">Customer Name</th>
              <th className="px-4 py-3 w-[12%] lg:max-xl:w-[15%] lg:table-cell hidden">
                Total
              </th>
              <th className="px-4 py-3 w-[16%] lg:max-xl:w-[19%] md:w-[17%]">
                Date
              </th>
              <th className="px-4 text-center py-3 w-[45%] lg:max-xl:w-[53%] md:max-lg:w-[68%]">
                Action
              </th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={colSpan}>
                  <div className="flex justify-center items-center h-full w-full py-6">
                    <FaSpinner className="animate-spin text-[30px]" />
                  </div>
                </td>
              </tr>
            </tbody>
          ) : filteredOrders.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={colSpan}>
                  <div className="text-center py-6 text-gray-600 w-full">
                    <p>Aucune commande trouvée.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {currentOrders.map((item) => (
                <tr key={item._id} className="even:bg-gray-100 odd:bg-white">
                  <td className="border px-4 py-2 uppercase truncate">
                    {item.ref}
                  </td>
                  <td className="border px-4 py-2 uppercase max-xl:hidden truncate">
                    {item?.user?.username}
                  </td>
                  <td className="border px-4 py-2 text-start lg:table-cell hidden">
                    {item.total.toFixed(2)} TND
                  </td>
                  <td className="border px-4 py-2 truncate">
                    {new Date(item.createdAt).toLocaleDateString("en-GB")} -{" "}
                    {new Date(item.createdAt).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex justify-center gap-2">
                      <select
                        className={`w-full h-10 text-black rounded-md p-2 truncate ${
                          item.orderStatus === "Processing"
                            ? "bg-gray-800 text-white"
                            : "bg-red-700 text-white"
                        }`}
                        value={item.orderStatus}
                        onChange={(e) =>
                          updateOrderStatus(item._id, e.target.value)
                        }
                      >
                        <option value="Processing">En cours</option>
                        <option value="Pack">Expédiée</option>
                        <option value="Deliver">Livrée</option>
                        <option value="Cancelled">Annulée</option>
                        <option value="Refunded">Remboursée</option>
                      </select>
                      <Link href={`/admin/order/${item.ref}`}>
                        <button className="bg-gray-800 text-white p-3 hover:bg-gray-600 rounded-md uppercase">
                          <FaRegEye />
                        </button>
                      </Link>
                      <Link href={`/admin/order/editorder/${item.ref}`}>
                        <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                          <FaRegEdit />
                        </button>
                      </Link>
                      <select
                        className={`w-full h-10 text-black rounded-md p-2 truncate ${
                          item.statusinvoice === false
                            ? "bg-gray-400 text-white"
                            : "bg-green-500 text-white"
                        }`}
                        value={item.statusinvoice.toString()}
                        onChange={(e) =>
                          updatestatusinvoice(item._id, e.target.value)
                        }
                      >
                        <option value="true" className="text-white uppercase">
                          approve
                        </option>
                        <option value="false" className="text-white uppercase">
                          Not approve
                        </option>
                      </select>
                      {item.statusinvoice === false ? (
                        <Link href={`/admin/order/bondelivraison/${item.ref}`}>
                          <button className="bg-gray-800 text-white px-4 h-10 hover:bg-gray-600 rounded-md uppercase">
                            INVOICE
                          </button>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleinvoice(item._id)}
                          className="bg-gray-800 text-white px-4 h-10 hover:bg-gray-600 rounded-md uppercase"
                        >
                          Invoice
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="bg-gray-800 text-white pl-3 w-10 min-w-10 h-10 hover:bg-gray-600 rounded-md"
                        disabled={loadingOrderId === item._id}
                      >
                        {loadingOrderId === item._id ? (
                          "Processing..."
                        ) : (
                          <FaTrashAlt />
                        )}
                      </button>
                      {isPopupOpen && (
                        <DeletePopup
                          handleClosePopup={handleClosePopup}
                          Delete={DeleteOrder}
                          id={selectedOrder.id} // Pass selected user's id
                          name={selectedOrder.name}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <div className="space-y-4 md:hidden">
        {loading ? (
          <div className="flex justify-center items-center h-full w-full py-6">
            <FaSpinner className="animate-spin text-[30px]" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-6 text-gray-600 w-full">
            <p>Aucune commande trouvée.</p>
          </div>
        ) : (
          currentOrders.map((item) => (
            <div
              key={item._id}
              className="p-4 mb-4 flex flex-col gap-4 bg-gray-100 rounded shadow-md"
            >
              <div>
                <div className="flex justify-between">
                  <p className=" px-4 py-2 uppercase truncate">{item.ref}</p>
                  <p className=" px-4 py-2 text-start  truncate ">
                    {item.total.toFixed(2)} TND
                  </p>
                </div>

                <div className="flex justify-between">
                  <p className=" px-4 py-2 uppercase  truncate">
                    {item?.user?.username}
                  </p>
                  <div className=" px-4 py-2 truncate">
                    {new Date(item.createdAt).toLocaleDateString("en-GB")} -{" "}
                    {new Date(item.createdAt).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>

              <div className=" px-4 py-2">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-center gap-2">
                    <select
                      className={`w-50 h-10 text-black rounded-md p-2 truncate ${
                        item.orderStatus === "Processing"
                          ? "bg-gray-800 text-white"
                          : "bg-red-700 text-white"
                      }`}
                      value={item.orderStatus}
                      onChange={(e) =>
                        updateOrderStatus(item._id, e.target.value)
                      }
                    >
                      <option value="Processing">En cours</option>
                      <option value="Pack">Expédiée</option>
                      <option value="Deliver">Livrée</option>
                      <option value="Cancelled">Annulée</option>
                      <option value="Refunded">Remboursée</option>
                    </select>

                    <select
                      className={`w-50 h-10 text-black rounded-md p-2 truncate ${
                        item.statusinvoice === false
                          ? "bg-gray-400 text-white"
                          : "bg-green-500 text-white"
                      }`}
                      value={item.statusinvoice.toString()}
                      onChange={(e) =>
                        updatestatusinvoice(item._id, e.target.value)
                      }
                    >
                      <option value="true" className="text-white uppercase">
                        approve
                      </option>
                      <option value="false" className="text-white uppercase">
                        Not approve
                      </option>
                    </select>
                  </div>
                  <div className="flex justify-center gap-2">
                    {item.statusinvoice === false ? (
                      <Link href={`/admin/order/bondelivraison/${item.ref}`}>
                        <button className="bg-gray-800 text-white px-4 h-10 hover:bg-gray-600 rounded-md uppercase">
                          INVOICE
                        </button>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleinvoice(item._id)}
                        className="bg-gray-800 text-white px-4 h-10 hover:bg-gray-600 rounded-md uppercase"
                      >
                        Invoice
                      </button>
                    )}
                    <Link href={`/admin/order/${item.ref}`}>
                      <button className="bg-gray-800 text-white p-3 hover:bg-gray-600 rounded-md uppercase">
                        <FaRegEye />
                      </button>
                    </Link>
                    <Link href={`/admin/order/editorder/${item.ref}`}>
                      <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                        <FaRegEdit />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md"
                      disabled={loadingOrderId === item._id}
                    >
                      {loadingOrderId === item._id ? (
                        "Processing..."
                      ) : (
                        <FaTrashAlt />
                      )}
                    </button>
                  </div>
                  {isPopupOpen && (
                    <DeletePopup
                      handleClosePopup={handleClosePopup}
                      Delete={DeleteOrder}
                      id={selectedOrder.id} // Pass selected user's id
                      name={selectedOrder.name}
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalPages)}
          onPageChange={setCurrentPage}
        />
      </div>
      {isPopupOpeninvoice && (
        <ConfirmPopup
          handleClosePopupinvoice={handleClosePopupinvoice}
          handleinvoiceconfirm={handleinvoiceconfirm}
          selectedorderid={selectedorderid}
          selectedval={selectedval}
        />
      )}
    </div>
  );
};

export default ListOrders;
