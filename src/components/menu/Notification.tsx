'use client';

import React, { useEffect, useRef, useState, useCallback } from "react";
import { AiOutlineBell } from "react-icons/ai";
import ListNotification from "./listNotification";
import { useRouter } from "next/navigation";

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
  updatedAt: string;
}

const Notification: React.FC = () => {
  const [notif, setNotif] = useState<number>(0);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [isListVisible, setListVisible] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  const handleViewOrder = async (item: Notification) => {
    try {
      const response = await fetch(`/api/notification/updatenotification/${item._id}`, {
        method: "PUT",
      });
      if (response.ok) {
        router.push(`/admin/order/${item.order.ref}`);
        setListVisible(false);
        fetchNotifications();
      } else {
        console.error("Error updating notification");
      }
    } catch (err) {
      console.error("Error handling order view:", err);
    }
  };

  const toggleListVisibility = async () => {
    setListVisible((prev) => !prev);
    if (!isListVisible) {
      try {
        await fetch("/api/notification/updatenotifications", {
          method: "PUT",
          body: JSON.stringify(notifs.map((n) => ({ _id: n._id }))),
        });
        fetchNotifications();
      } catch (err) {
        console.error("Error toggling list visibility:", err);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setListVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 3000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return (
    <div ref={listRef} className="flex items-center gap-2 text-white cursor-pointer select-none max-xl:hidden">
      <div className="relative" onClick={toggleListVisibility}>
        <AiOutlineBell size={40} className="text-primary" />
        {notif > 0 && (
          <span className="w-4 h-4 flex justify-center items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-secondary">
            {notif}
          </span>
        )}
      </div>
      <ListNotification
        data={notifs}
        isListVisible={isListVisible}
        handleViewOrder={handleViewOrder}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Notification;
