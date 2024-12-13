'use client';

import React from "react";

interface Notification {
  _id: string;
  order: {
    _id: string;
    user: {
      username: string;
    };
    ref: string;
  };
  look: string; // To check if the notification is read
  createdAt: string;
  updatedAt: string; // Added to match the required type
}

interface ListNotificationProps {
  data: Notification[];
  isListVisible: boolean;
  handleViewOrder: (item: Notification) => Promise<void>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const ListNotification: React.FC<ListNotificationProps> = ({
  data,
  isListVisible,
  handleViewOrder,
  currentPage,
  setCurrentPage,
}) => {
  // Pagination logic
  const notificationsPerPage = 5;
  const startIndex = (currentPage - 1) * notificationsPerPage;
  const endIndex = startIndex + notificationsPerPage;
  const visibleNotifications = data.slice(startIndex, endIndex);

  if (!isListVisible) return null;

  const timeAgo = (date: string): string => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);
    const weeks = Math.floor(diffInSeconds / 604800);

    if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="absolute top-12 right-0 bg-white border rounded-md shadow-lg w-80 p-4">
      <h3 className="text-lg font-semibold mb-2">Notifications</h3>
      {visibleNotifications.length > 0 ? (
        visibleNotifications.map((notification) => (
          <div
            key={notification._id}
            className={`p-2 border-b cursor-pointer hover:bg-gray-100 ${
              notification.look === 'false' ? 'bg-gray-200' : ''
            }`}
            onClick={() => handleViewOrder(notification)}
          >
            <p className="text-sm">{`Order by ${notification.order.user.username}`}</p>
            <p className="text-xs text-gray-500">{timeAgo(notification.createdAt)}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No notifications</p>
      )}
      <div className="flex justify-between items-center mt-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="text-sm text-blue-500 disabled:text-gray-400"
        >
          Previous
        </button>
        <button
          disabled={endIndex >= data.length}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="text-sm text-blue-500 disabled:text-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ListNotification;
