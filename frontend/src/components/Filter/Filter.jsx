import React, { useState } from "react";
import "./Filter.css";
import { MdArrowDropDown } from "react-icons/md";

function FilterOption({
  value,
  description,
  selectedOptions,
  handleCheckboxChange,
}) {
  return (
    <div className="filter-option">
      <input
        type="checkbox"
        id={value}
        name={value}
        checked={selectedOptions[value] || false}
        onChange={handleCheckboxChange}
      />
      <label htmlFor={value}>{description}</label>
    </div>
  );
}

export default function Filter({
  title,
  options,
  selectedOptions,
  handleCheckboxChange,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="filter">
      <div className="filter__title" onClick={toggleDropdown}>
        <MdArrowDropDown className="filter__icon" />
        <h3>{title}</h3>
      </div>
      <div className={`filter-options ${isOpen ? "active" : ""}`}>
        {isOpen &&
          options.map((option) => (
            <FilterOption
              key={option.value}
              value={option.value}
              description={option.description}
              selectedOptions={selectedOptions}
              handleCheckboxChange={handleCheckboxChange}
            />
          ))}
      </div>
    </div>
  );
}
