import { useState } from "react";

function BasicMenu({
  options,
  defaultValue,
  onOptionChange,
}: {
  options: number[];
  defaultValue: number;
  onOptionChange: (value: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (option: number) => {
    setSelectedOption(option);
    onOptionChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="text-sm border rounded-md h-9 w-9"
        onClick={handleClick}
      >
        <span>{selectedOption}</span>
        <span className="ml-[1px]">▼</span>
      </button>
  
      {isOpen && (
        <ul className="absolute z-10 bg-white border border-gray-300 ">
          {options.map((option, index) => (
            <li
              key={index}
              className="flex items-center justify-center text-xs rounded-md cursor-pointer h-9 w-9"
              onClick={() => handleOptionChange(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
}

export default BasicMenu;
