import React from 'react';

interface OrderPriceProps {
  setSortOrder: (order: 'asc' | 'desc') => void;
  sortOrder: 'asc' | 'desc';
}

const OrderPrice: React.FC<OrderPriceProps> = ({ setSortOrder, sortOrder }) => {
  return (
    <div className="mb-4  flex flex-col justify-end items-end">
      <label htmlFor="sort-order" className="font-bold">Sort by Price:</label>
      <select
        id="sort-order"
        className="w-[150px] p-2  border border-gray-300 rounded"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
      >
        <option value="asc">Low to High</option>
        <option value="desc">High to Low</option>
      </select>
    </div>
  );
};

export default OrderPrice;
