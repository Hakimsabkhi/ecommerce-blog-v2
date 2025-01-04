// /src/app/components/listNotification.tsx
import React from "react";
import { Notification } from "./Notification";

interface ListNotificationProps {
  data: Notification[];
  handleViewOrder: (item: Notification) => void;
}

const ListNotification: React.FC<ListNotificationProps> = ({
  data,
  handleViewOrder,
}) => {
  return (
    <ul className="bg-white p-4 w-64">
      {data.map((item) => (
        <li
          key={item._id}
          onClick={() => handleViewOrder(item)}
          className="border-b last:border-b-0 py-2 cursor-pointer hover:bg-gray-100"
        >
          {/* Example rendering */}
          <p>Order Ref: {item.order.ref}</p>
          <p>Status: {item.look ? "Read" : "Unread"}</p>
        </li>
      ))}
    </ul>
  );
};

export default ListNotification;
