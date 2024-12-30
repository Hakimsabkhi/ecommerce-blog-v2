"use client";

import React from "react";

interface User {
  username: string;
}

interface Order {
  _id: string;
  user: User;
  ref: string;
}

interface Notification {
  _id: string;
  order: Order;
  look: string;
  createdAt: string;
  updatedAt: string; // Ensure this is included
}

interface ListNotificationProps {
  data: Notification[];
  handleViewOrder: (item: Notification) => Promise<void>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const ListNotification: React.FC<ListNotificationProps> = ({
  data,
  handleViewOrder,
  currentPage,
  setCurrentPage,
}) => {
  const notificationsPerPage = 5;
  const startIndex = (currentPage - 1) * notificationsPerPage;
  const endIndex = startIndex + notificationsPerPage;

  return (
    <div className="flex flex-col px-4 w-[200px] max-md:w-[350px] border-[#15335D] border-4 rounded-lg bg-white z-30">
      {data.slice(startIndex, endIndex).map((notification) => (
        <div key={notification._id} onClick={() => handleViewOrder(notification)}>
          <p>{`Order by ${notification.order.user.username}`}</p>
        </div>
      ))}
      <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
      <button onClick={() => setCurrentPage((prev) => prev + 1)}>Next</button>
    </div>
  );
};

export default ListNotification;
