import React from "react";

function Navbar({ titles, onFilter }) {
  return (
    <div className="container my-5">
      {/* Barre du haut */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search Items"
            style={{ minWidth: "200px" }}
          />
        </div>
        <div className="d-flex gap-2">
          {/* Bouton New Item déclenche un formulaire inline */}
          <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newItemModal">
            New Item
          </button>

          {/* Remplace le bouton Filter par un select */}
          <select className="form-select" onChange={(e) => onFilter(e.target.value)}>
            <option value="">Tous les titres</option>
            {titles.map((title, index) => (
              <option key={index} value={title}>
                {title}
              </option>
            ))}
          </select>

          <button className="btn btn-outline-secondary">Board</button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
