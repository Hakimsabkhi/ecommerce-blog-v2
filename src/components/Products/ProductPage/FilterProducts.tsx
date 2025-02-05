import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css"; 

interface FilterProductsProps {
  selectedBrand: string | null;
  setSelectedBrand: (brand: string | null) => void;
  selectedBoutique: string | null;
  setSelectedBoutique: (brand: string | null) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  selectedMaterial: string | null;
  setSelectedMaterial: (material: string | null) => void;
  minPrice: number | null;
  setMinPrice: (price: number | null) => void;
  maxPrice: number | null;
  setMaxPrice: (price: number | null) => void;
  brands: { _id: string; name: string }[];
  boutique: { _id: string; nom: string }[];
  uniqueColors: string[];
  uniqueMaterials: string[];
}

const FilterProducts: React.FC<FilterProductsProps> = ({
  selectedBrand,
  setSelectedBrand,
  selectedBoutique,
  setSelectedBoutique,
  selectedColor,
  setSelectedColor,
  selectedMaterial,
  setSelectedMaterial,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  brands,
  boutique,
  uniqueColors,
  uniqueMaterials,
}) => {
  return (
    <div className="flex  flex-col w-full justify-center px-2">
      {/* Brand Filter */}
      <div className="mb-4">
        <label htmlFor="brand-filter" className="font-bold">
          Brand:
        </label>
        <select
          id="brand-filter"
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedBrand || ""}
          onChange={(e) => setSelectedBrand(e.target.value || null)}
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand._id} value={brand._id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="brand-filter" className="font-bold">
          Boutique:
        </label>
        <select
          id="brand-filter"
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedBoutique || ""}
          onChange={(e) => setSelectedBoutique(e.target.value || null)}
        >
          <option value="">All Boutique</option>
          {boutique.map((b) => (
            <option key={b._id} value={b._id}>
              {b.nom}
            </option>
          ))}
        </select>
      </div>

      {/* Color Filter */}
      <div className="mb-4">
        <label htmlFor="color-filter" className="font-bold">
          Color:
        </label>
        <select
          id="color-filter"
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedColor || ""}
          onChange={(e) => setSelectedColor(e.target.value || null)}
        >
          <option value="">All Colors</option>
          {uniqueColors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>

      {/* Material Filter */}
      <div className="mb-4">
        <label htmlFor="material-filter" className="font-bold">
          Material:
        </label>
        <select
          id="material-filter"
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedMaterial || ""}
          onChange={(e) => setSelectedMaterial(e.target.value || null)}
        >
          <option value="">All Materials</option>
          {uniqueMaterials.map((material) => (
            <option key={material} value={material}>
              {material}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-4">
  {/* Label for Price Range */}
  <label className="font-bold" htmlFor="price-range">Price Range:</label>

  {/* Min and Max Price Inputs */}
  <div className="flex gap-2 mb-2">
    <div className="w-1/2">
      <label htmlFor="min-price" className="sr-only">Minimum Price</label>
      <input
        aria-label="min-price"
        type="number"
        placeholder="Min Price"
        className="w-full p-2 border border-gray-300 rounded"
        value={minPrice || ""}
        onChange={(e) => setMinPrice(Number(e.target.value) || null)}
      />
    </div>
    <div className="w-1/2">
      <label htmlFor="max-price" className="sr-only">Maximum Price</label>
      <input
        aria-label="max-price"
        type="number"
        placeholder="Max Price"
        className="w-full p-2 border border-gray-300 rounded"
        value={maxPrice || ""}
        onChange={(e) => setMaxPrice(Number(e.target.value) || null)}
      />
    </div>
  </div>

  {/* Slider Component */}
  <div>
  <label id="price-range-label" className="font-bold"></label>
  <Slider
    aria-labelledby="price-range-label"
    range
    min={1}
    max={200000}
    value={[minPrice || 1, maxPrice || 200000]}
    onChange={(values) => {
      const [min, max] = values as number[];
      setMinPrice(min);
      setMaxPrice(max);
    }}
    allowCross={false}
    trackStyle={[{ backgroundColor: "#007bff" }]}
    handleStyle={[
      { borderColor: "#007bff", backgroundColor: "#fff" },
      { borderColor: "#007bff", backgroundColor: "#fff" },
    ]}
  />
</div>

</div>

    </div>
  );
};

export default FilterProducts;
