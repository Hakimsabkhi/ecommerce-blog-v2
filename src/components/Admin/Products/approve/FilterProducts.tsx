import React, {
  ReactElement,
  HTMLAttributes,
  cloneElement,
  useState 
} from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { FaFilter } from "react-icons/fa";

interface RenderProps {
  index: number;
  value: number;
  dragging: boolean;
}

// 1) Define your handleRender function
function handleRender(
  origin: ReactElement<HTMLAttributes<HTMLDivElement>>,
  { index, value }: RenderProps
): ReactElement<HTMLAttributes<HTMLDivElement>> {
  const ariaLabel =
    index === 0 ? "Minimum price slider handle" : "Maximum price slider handle";

  return cloneElement(origin, {
    role: "slider",
    "aria-label": ariaLabel,
    "aria-valuemin": 1,
    "aria-valuemax": 200000,
    "aria-valuenow": value,
    style: {
      ...origin.props.style,
      borderColor: "#007bff", // your custom color
      backgroundColor: "#fff",
    },
  });
}

// 2) Other interfaces (unchanged from your code)
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  return (
    <div className="xl:w-full rounded-md">
      {/* Filtre Button for md and below */}
      <div className="xl:hidden w-24 bg-slate-200 rounded-md">
        <button
          className="flex items-center  gap-2 px-4 py-2  rounded-md "
          onClick={() => setIsFilterOpen(true)}
        >
          <FaFilter />
          Filtre
        </button>
      </div>

      {/* Filter Panel (Always visible on lg, modal for md and below) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center xl:relative xl:bg-transparent xl:block xl:z-auto ${
          isFilterOpen ? "block" : "hidden xl:block"
        }`}
      >
        <div className="bg-white p-6 xl:p-1 rounded-lg shadow-lg w-11/12 max-w-md xl:max-w-full xl:w-full xl:shadow-none xl:bg-transparent">
          {/* Close Button for md and below */}
          <div className="flex justify-between items-center xl:hidden">
            <h2></h2>
            <h2 className="text-lg font-bold">Filtres</h2>
            <button className=" text-xl font-bold" onClick={() => setIsFilterOpen(false)}>
              X
            </button>
          </div>

          {/* Brand Filter */}
          <div className="mb-4">
            <label htmlFor="brand-filter" className="font-bold">
              Marque:
            </label>
            <select
              id="brand-filter"
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedBrand || ""}
              onChange={(e) => setSelectedBrand(e.target.value || null)}
            >
              <option value="">Toutes les marques</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Boutique Filter */}
          <div className="mb-4">
            <label htmlFor="boutique-filter" className="font-bold">
              Boutique:
            </label>
            <select
              id="boutique-filter"
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedBoutique || ""}
              onChange={(e) => setSelectedBoutique(e.target.value || null)}
            >
              <option value="">Toutes les boutiques</option>
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
              Couleur:
            </label>
            <select
              id="color-filter"
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedColor || ""}
              onChange={(e) => setSelectedColor(e.target.value || null)}
            >
              <option value="">Toutes les couleurs</option>
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
              Matériel:
            </label>
            <select
              id="material-filter"
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedMaterial || ""}
              onChange={(e) => setSelectedMaterial(e.target.value || null)}
            >
              <option value="">Tous les matériaux</option>
              {uniqueMaterials.map((material) => (
                <option key={material} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="mb-4">
            <label className="font-bold">Prix:</label>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                placeholder="Prix ​​minimum"
                className="w-1/2 p-2 border border-gray-300 rounded"
                value={minPrice || ""}
                onChange={(e) => setMinPrice(Number(e.target.value) || null)}
              />
              <input
                type="number"
                placeholder="Prix ​​maximum"
                className="w-1/2 p-2 border border-gray-300 rounded"
                value={maxPrice || ""}
                onChange={(e) => setMaxPrice(Number(e.target.value) || null)}
              />
            </div>
            <Slider
              range
              min={1}
              max={10000}
              value={[minPrice || 1, maxPrice || 10000]}
              onChange={(values) => {
                const [min, max] = values as number[];
                setMinPrice(min);
                setMaxPrice(max);
              }}
              allowCross={false}
              trackStyle={[{ backgroundColor: "#007bff" }]}
              handleRender={handleRender}
            />
          </div>

          {/* Apply Filters Button (md and below) */}
          <div className="flex justify-end xl:hidden">
            <button
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-md shadow-md"
              onClick={() => setIsFilterOpen(false)}
            >
              Appliquer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterProducts;
