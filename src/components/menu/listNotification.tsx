import React, { useState, useMemo, useEffect } from "react";
import { Notification } from "./Notification";
import Pagination from "@/components/Pagination";
import { FaSpinner } from "react-icons/fa";

interface ListNotificationProps {
  data: Notification[];
  handleViewOrder: (item: Notification) => void;
}

const ListNotification: React.FC<ListNotificationProps> = ({
  data,
  handleViewOrder,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 4;
  const totalPages = useMemo(
    () => Math.ceil(data.length / dataPerPage),
    [data.length]
  );

  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  /**
   * 1) Derived data for the current page
   */
  const paginatedData = useMemo(() => {
    return data.slice(
      (currentPage - 1) * dataPerPage,
      currentPage * dataPerPage
    );
  }, [data, currentPage, dataPerPage]);

  /**
   * 2) Ensure that the current page is within bounds when data changes
   */
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /**
   * 3) Local click handler to show item-level loading
   */
  const handleItemClick = async (item: Notification) => {
    // Show spinner only for this specific item
    setLoadingItemId(item._id);

    // Call the parent-provided handler, e.g. marking as read + redirect
    await handleViewOrder(item);

    // Hide spinner
    setLoadingItemId(null);
  };

  /**
   * 4) Render
   */
  return (
    <div>
      <div>
        <h1 className="text-lg font-bold text-black text-center py-2 max-md:text-sm">
          Order Notification
        </h1>
        {data.length > 0 ? (
          paginatedData.map((item) => (
            <div
              key={item._id}
              onClick={() => handleItemClick(item)}
              className="h-fit"
            >
              {/* Conditionally render a spinner for this specific item */}
              {loadingItemId === item._id ? (
                <div className="flex justify-center items-center py-6">
                                  <FaSpinner className="animate-spin text-[30px] text-gray-800" />
                                </div>
              ) : (
                <div
                key={item._id}
                onClick={() => handleItemClick(item)}
                className="border-b last:border-b-0 p-2 cursor-pointer hover:bg-primary hover:text-white"
              >
                <p>Order Ref: {item.order.ref}</p></div>
              )}
            </div>
          ))
        
        ) : (
          <p className="text-center text-black">No notifications.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="py-2 text-gray-500">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ListNotification;
