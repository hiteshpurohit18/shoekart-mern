import { useState } from "react";
import SectionHeader from "../ui/SectionHeader";
import CategoryButtons from "../components/CategoryButtons";
import ProductList from "../features/products/ProductList";
import FilterDropdown from "../components/FilterDropdown";
import SearchInput from "../components/SearchInput";

export default function Home() {
  const [filter, setFilter] = useState(""); // category (men/women/casual/formal/trending)
  const [filters, setFilters] = useState({}); // dropdown filters

  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader
          title="Explore Our Collection"
          subtitle="Shop trending and curated categories"
        />

        {/* Category buttons */}
        <div className="flex justify-center">
          <CategoryButtons selected={filter} onChange={setFilter} />
        </div>

        {/* Search + Filter Row */}
        <div className="mt-4 flex items-center justify-end gap-3 pr-4 sm:pr-8">
          <div className="flex items-center gap-10 md:gap-60">
            <SearchInput
              onSearch={(value) => {
                setFilters((prev) => ({ ...prev, search: value }));
              }}
            />

            <div className="relative z-10">
              <FilterDropdown
                onFilterChange={(f) => {
                  setFilters((prev) => ({ ...prev, ...f }));
                }}
              />
            </div>
          </div>
        </div>

        {/* Product list */}
        <div className="mt-6">
          <ProductList
            filters={{
              ...filters,

              // Trending
              ...(filter === "trending" ? { trending: true } : {}),

              // Gender filters
              ...(filter === "men" ? { gender: "men" } : {}),
              ...(filter === "women" ? { gender: "women" } : {}),

              // Category filters
              ...(filter === "casual" ? { category: "casual" } : {}),
              ...(filter === "formal" ? { category: "formal" } : {}),

              // All
              ...(filter === "" ? {} : {}),
            }}
          />
        </div>
      </div>
    </div>
  );
}
