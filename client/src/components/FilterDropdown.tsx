import { useState, useRef, useEffect } from "react";

interface Props {
  onFilterChange: (filter: {
    sort?: string;
    gender?: string;
    category?: string;
  }) => void;
}

export default function FilterDropdown({ onFilterChange }: Props) {
  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  function toggleDropdown() {
    if (!open) {
      setOpen(true);
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      setTimeout(() => setOpen(false), 150);
    }
  }

  function handleSelection(key: string, value: string) {
    onFilterChange({ [key]: value });
    toggleDropdown();
  }

  // Outside click close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        animate && setAnimate(false);
        setTimeout(() => setOpen(false), 150);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, animate]);

  return (
    <div
      className="relative mb-6 flex justify-end pr-4 sm:pr-8"
      ref={dropdownRef}
    >
      {/* Filter Button */}
      <button
        onClick={toggleDropdown}
        className="flex h-[42px] items-center rounded-md px-4 py-2 text-black mt-3"
      >
        Filters ▼
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute right-0 mt-2 w-52 transform rounded-md border bg-white p-2 shadow-lg  transition-all duration-200 ${animate ? "translate-y-0 scale-100 opacity-80" : "-translate-y-2 scale-95 opacity-0"} `}
        >
          <p className="mb-1 text-sm font-semibold">Sort By</p>

          <button
            onClick={() => handleSelection("sort", "lowToHigh")}
            className="block w-full p-2 text-left hover:bg-gray-100"
          >
            Price: Low → High
          </button>

          <button
            onClick={() => handleSelection("sort", "highToLow")}
            className="block w-full p-2 text-left hover:bg-gray-100"
          >
            Price: High → Low
          </button>

          <button
            onClick={() => handleSelection("sort", "brand")}
            className="block w-full p-2 text-left hover:bg-gray-100"
          >
            Brand (A–Z)
          </button>

          <hr className="my-2" />

          <p className="mb-1 text-sm font-semibold">Gender</p>

          <button
            onClick={() => handleSelection("gender", "men")}
            className="block w-full p-2 text-left hover:bg-gray-100"
          >
            Men
          </button>

          <button
            onClick={() => handleSelection("gender", "women")}
            className="block w-full p-2 text-left hover:bg-gray-100"
          >
            Women
          </button>

          <hr className="my-2" />

          <p className="mb-1 text-sm font-semibold">Category</p>

          <button
            onClick={() => handleSelection("category", "casual")}
            className="block w-full p-2 text-left hover:bg-gray-100"
          >
            Casual
          </button>

          <button
            onClick={() => handleSelection("category", "formal")}
            className="block w-full p-2 text-left hover:bg-gray-100"
          >
            Formal
          </button>
        </div>
      )}
    </div>
  );
}
