import React from "react";

const FilterBar = ({ onFilter }) => {
  return (
    <div className="filter-bar">
      <select onChange={(e) => onFilter(e.target.value)}>
        <option value="">All Subjects</option>
        <option value="Math">Math</option>
        <option value="Science">Science</option>
        <option value="Engineering">Engineering</option>
      </select>
    </div>
  );
};

export default FilterBar;
