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
        className="w-12 h-10 text-sm border rounded-md"
        onClick={handleClick}
      >
        <span>{selectedOption}</span>
        <span className="ml-1">▼</span>
      </button>
  
      {isOpen && (
        <ul className="absolute z-10 bg-white border border-gray-300 ">
          {options.map((option, index) => (
            <li
              key={index}
              className="flex items-center justify-center w-12 h-10 text-sm rounded-md cursor-pointer"
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
