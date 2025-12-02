import { useState } from "react";

interface Props {
  onSearch: (value: string) => void;
}
export default function SearchInput({ onSearch }: Props) {
  const [text, setText] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setText(value);
    onSearch(value);
  }

  return (
    <input
      type="text"
      placeholder="Search shoes... "
      value={text}
      onChange={handleChange}
      className="h-[42px] w-40 bg-white rounded-3xl border-gray-500 px-3 py-2 transition-all focus:ring-2 focus:ring-black focus:outline-none sm:w-56 md:w-64"
    />
  );
}
