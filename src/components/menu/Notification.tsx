"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { AiOutlineBell } from "react-icons/ai";
import ListNotification from "./listNotification";
import { useRouter } from "next/navigation";
import useClickOutside from "@/hooks/useClickOutside";

export interface User {
  username: string;
}

export interface Order {
  _id: string;
  user: User;
  ref: string;
}

export interface Notification {
  _id: string;
  order: Order;
  look: string;
  createdAt: string;
  updatedAt: string; // Ensure updatedAt is included
}


const Notification: React.FC = () => {
  const [notif, setNotif] = useState<number>(0);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [notificationState, setNotificationState] = useState({
    isOnScroll: false,
    isOpen: false,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const router = useRouter();
  const ListNotificationsWrapperRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch(`/api/notification/getnotification?page=${currentPage}&limit=10`);
      if (!response.ok) throw new Error("Failed to fetch notifications");

      const { notifications } = await response.json();
      if (!Array.isArray(notifications)) throw new Error("Invalid data format from API");

      const unreadCount = notifications.filter((notification) => notification.look === "false").length;

      setNotif(unreadCount);
      setNotifs(notifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, [currentPage]);

  const toggleListNotifications = () => {
    setNotificationState((prevState) => ({
      ...prevState,
      isOpen: !prevState.isOpen,
    }));
  };

  const closeListNotifications = () => {
    setNotificationState((prevState) => ({
      ...prevState,
      isOpen: false,
    }));
  };

  const handleViewOrder = async (item: Notification) => {
    try {
      const response = await fetch(`/api/notification/updatenotification/${item._id}`, {
        method: "PUT",
      });
      if (response.ok) {
        router.push(`/admin/order/${item.order.ref}`);
        fetchNotifications();
      } else {
        console.error("Error updating notification");
      }
    } catch (err) {
      console.error("Error handling order view:", err);
    }
  };

  useClickOutside(ListNotificationsWrapperRef, closeListNotifications);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="flex items-center justify-center w-[200px] max-lg:w-fit text-primary cursor-pointer select-none">
      <div
        className="flex items-center justify-center gap-2 w-fit max-lg:w-fit text-primary"
        onClick={toggleListNotifications}
      >
        <div className="relative my-auto mx-2">
          <div>
            <AiOutlineBell size={40} aria-label="Notification bell" />
            {notif >= 0 && (
              <span className="w-4 flex justify-center h-4 items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-secondary">
                {notif}
              </span>
            )}
          </div>
          <div
            className="absolute max-md:fixed shadow-xl z-30 flex gap-2 flex-col top-12 left-1/2 -translate-x-1/3 max-md:-translate-x-1/2 max-md:top-16"
            ref={ListNotificationsWrapperRef}
            onClick={(e) => e.stopPropagation()}
          >
            {notificationState.isOpen && (
              <ListNotification
                data={notifs}
                handleViewOrder={handleViewOrder}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
