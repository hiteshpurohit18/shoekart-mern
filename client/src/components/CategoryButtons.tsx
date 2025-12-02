interface Props {
  selected: string;
  onChange: (category: string) => void;
}

const categories = [
  { id: "", label: "All" },
  { id: "trending", label: "Trending⚡" },
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "casual", label: "Casual" },
  { id: "formal", label: "Formal" },
];

export default function CategoryButtons({ selected, onChange }: Props) {
  return (
    <div className="mt-4 mb-6 flex flex-wrap justify-center gap-3 px-2">
      {categories.map((category) => (
        <button
          key={category.id === "" ? "all" : category.id}
          onClick={() => onChange(category.id)}
          className={`cursor-pointer rounded-full border px-4 py-2 text-sm hover:bg-black hover:text-white ${
            selected === category.id
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          aria-pressed={selected === category.id}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
