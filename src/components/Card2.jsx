
import { useState } from 'react'


const getAvatar = (id) =>
    `https://randomuser.me/api/portraits/men/${id}.jpg`;

function Card() {
    const [columns, setColumns] = useState([
        { title: "To do", items: [] },
        { title: "In Progress", items: [] },
        { title: "In Review", items: [] },
        { title: "Done", items: [] },
      ]);
    
      const [newItem, setNewItem] = useState({ title: "", tag: "", date: "" });
      const [columnIndex, setColumnIndex] = useState(0); 
    
      const handleAddNewItem = () => {
        if (!newItem.title || !newItem.tag || !newItem.date)
          return alert("Tous les champs sont requis !");
        
        const updatedColumns = [...columns];
        updatedColumns[columnIndex].items.unshift({
          ...newItem,
          users: [Math.floor(Math.random() * 10) + 1],
        });
        setColumns(updatedColumns);
        setNewItem({ title: "", tag: "", date: "" });
        setColumnIndex(0);
      };

      const handleDelete = (colIndex, itemIndex) => {
        const updatedColumns = [...columns];
        updatedColumns[colIndex].items.splice(itemIndex, 1); // retire la carte
        setColumns(updatedColumns);
      };
      
    

  return (
    <>
 {/* Modal pour ajout de carte */}
 <div className="modal fade" id="newItemModal" tabIndex="-1" aria-labelledby="newItemModalLabel" aria-hidden="true">
 <div className="modal-dialog">
   <div className="modal-content">
     <div className="modal-header">
       <h5 className="modal-title" id="newItemModalLabel">Ajouter une nouvelle carte</h5>
       <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
     </div>
     <div className="modal-body">
       <input
         type="text"
         className="form-control mb-2"
         placeholder="Titre"
         value={newItem.title}
         onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
       />
       <input
         type="text"
         className="form-control mb-2"
         placeholder="Tag"
         value={newItem.tag}
         onChange={(e) => setNewItem({ ...newItem, tag: e.target.value })}
       />
       <input
         type="date"
         className="form-control mb-2"
         value={newItem.date}
         onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
       />
       <select
         className="form-select"
         value={columnIndex}
         onChange={(e) => setColumnIndex(Number(e.target.value))}
       >
         {columns.map((col, index) => (
           <option key={index} value={index}>
             {col.title}
           </option>
         ))}
       </select>
     </div>
     <div className="modal-footer">
       <button className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
       <button className="btn btn-primary" onClick={handleAddNewItem} data-bs-dismiss="modal">Ajouter</button>
     </div>
   </div>
 </div>
</div>

    <div className="row">
    {columns.map((column, i) => (
      <div key={i} className="col-md-3 mb-3">
        <div className="card">
          <div className="card-header back fw-bold d-flex justify-content-between align-items-center">
            {column.title}
            <div>
              <span className="badge bg-secondary me-1">{column.items.length}</span>
              <button className="btn btn-sm btn-light me-1">+</button>
              <button className="btn btn-sm btn-light">⋯</button>
            </div>
          </div>
          <div className="card-body p-2 back">
            {column.items.map((item, j) => (
              <div key={j} className="card mb-3 shadow-sm border-0">
                <div className="card-body">
                <div className="position-absolute top-0 end-0 m-2">
        <button className="btn btn-sm btn-outline-primary me-1">
          <i className="bi bi-pencil"></i>
        </button>
        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(i ,j)}>
          <i className="bi bi-trash"></i>
        </button>
      </div>
                  <h5 className="card-title mb-2">{item.title}</h5>
                  <span className="badge bg-primary mb-3">{item.tag}</span>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2 text-muted">
                      <i className="bi bi-paperclip"></i>
                      <i className="bi bi-flag text-warning"></i>
                      <i className="bi bi-clock"></i>
                      <small>{item.date}</small>
                    </div>
                    <div className="d-flex">
                      {item.users.map((uid) => (
                        <img
                          key={uid}
                          src={getAvatar(uid)}
                          alt="avatar"
                          className="rounded-circle border"
                          width="28"
                          height="28"
                          style={{ marginLeft: "-8px", zIndex: 1 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div> 
  </>
  )
}

export default Card