import { useEffect, useState } from "react";


function Search({ setFilteredColumn  , setSearchText,columns }) {
  const [selectedColumn, setSelectedColumn] = useState("");

  const [inputText, setInputText] = useState("");

  useEffect(() => {
    setFilteredColumn(selectedColumn); // envoie la colonne sélectionnée
    setSearchText(inputText);          // envoie le texte de recherche
  }, [selectedColumn, inputText, setFilteredColumn, setSearchText]);


  const handleSelect = (colTitle) => {
    setSelectedColumn(colTitle);
  };

  return (
        
         <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
         <div className="d-flex align-items-center flex-wrap gap-3">
           <input
             type="text"
             className="form-control"
             placeholder="Rechercher un titre..."
             style={{ minWidth: "200px" }}
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
           />
         </div>
         <div className="d-flex gap-2">
           <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newItemModal">New Item</button>
           <div className="dropdown">
          <button
            className="btn btn-outline-secondary dropdown-toggle"
            type="button"
            id="columnFilterDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {selectedColumn || 'Filtrer'}
          </button>
          <ul className="dropdown-menu" aria-labelledby="columnFilterDropdown">
            <li>
              <button className="dropdown-item" onClick={() => handleSelect('')}>
                Toutes les colonnes
              </button>
            </li>
            {columns.map((col, index) => (
              <li key={index}>
                <button className="dropdown-item" onClick={() => handleSelect(col.title)}>
                  {col.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
           <button className="btn btn-outline-secondary">Board</button>
         </div>
       </div>
  )
}

export default Search

