import { useEffect, useState } from 'react'
import Modal from 'bootstrap/js/dist/modal';
import axios from 'axios';
import Search from './Search';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';



const getAvatar = (id) =>
  `https://randomuser.me/api/portraits/men/${id}.jpg`;

function Card() {
  const [columns, setColumns] = useState([
    // { title: "To do", items: [] },
    // { title: "In Progress", items: [] },
    // { title: "In Review", items: [] },
    // { title: "Done", items: [] },
  ]);

  const [newItem, setNewItem] = useState({ title: "", tag: "", date: "" });
  const [columnIndex, setColumnIndex] = useState(0);
  const [editItem, setEditItem] = useState(null);
  const [filteredColumn, setFilteredColumn] = useState("");
  const [searchText, setSearchText] = useState("");


  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await axios.get("https://drag-crud-backend.onrender.com/cards");
        const loadedColumns = [
          { title: "To do", items: [] },
          { title: "In Progress", items: [] },
          { title: "In Review", items: [] },
          { title: "Done", items: [] },
        ];

        res.data.forEach((card) => {
          const colIndex = loadedColumns.findIndex(c => c.title === card.column);
          if (colIndex !== -1) {
            loadedColumns[colIndex].items.push(card);
          }
        });

        setColumns(loadedColumns);
      } catch (error) {
        console.error("Erreur de chargement des cartes :", error);
      }
    };

    fetchCards();
  }, []);

  // ➕ Ajouter une nouvelle carte
  const handleAddNewItem = async () => {
    if (!newItem.title || !newItem.tag || !newItem.date)
      return alert("Tous les champs sont requis !");

    try {
      const response = await axios.post("https://drag-crud-backend.onrender.com/cards", {
        ...newItem,
        column: columns[columnIndex].title,
        users: [Math.floor(Math.random() * 10) + 1],
      });

      const updatedColumns = [...columns];
      updatedColumns[columnIndex].items.unshift(response.data);
      setColumns(updatedColumns);
      setNewItem({ title: "", tag: "", date: "" });
      setColumnIndex(0);
    } catch (error) {
      console.error("Erreur lors de l’ajout :", error);
      alert("Erreur lors de l’ajout de la carte");
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm("Supprimer cette carte ?")) {
      try {
        await axios.delete(`https://drag-crud-backend.onrender.com/cards/${item._id}`);
        const updatedColumns = columns.map((col) => ({
          ...col,
          items: col.items.filter((i) => i._id !== item._id),
        }));
        setColumns(updatedColumns);
      } catch (error) {
        console.error("Erreur de suppression :", error);
      }
    }
  };
  
  const handleUpdateItem = async () => {
    if (!newItem.title || !newItem.tag || !newItem.date || !editItem)
      return alert("Tous les champs sont requis !");
  
    try {
      const updated = {
        ...editItem,
        ...newItem,
        column: columns[columnIndex].title,
      };
  
      const res = await axios.put(`https://drag-crud-backend.onrender.com/cards/${editItem._id}`, updated);
  
      const updatedColumns = [...columns].map((col, i) => {
        if (i === columnIndex) {
          return {
            ...col,
            items: [res.data, ...col.items.filter(c => c._id !== editItem._id)],
          };
        } else {
          return {
            ...col,
            items: col.items.filter(c => c._id !== editItem._id),
          };
        }
      });
  
      setColumns(updatedColumns);
      setEditItem(null);
      setNewItem({ title: "", tag: "", date: "" });
      setColumnIndex(0);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Erreur lors de la modification");
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setNewItem({ title: item.title, tag: item.tag, date: item.date });
    const colIndex = columns.findIndex(col => col.title === item.column);
    setColumnIndex(colIndex);
    const modal = new Modal(document.getElementById("newItemModal"));
    modal.show();

  };
  
    useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await axios.get("https://drag-crud-backend.onrender.com/cards");
        const loadedColumns = [
          { title: "To do", items: [] },
          { title: "In Progress", items: [] },
          { title: "In Review", items: [] },
          { title: "Done", items: [] },
        ];

        res.data.forEach((card) => {
          const colIndex = loadedColumns.findIndex(c => c.title === card.column);
          if (colIndex !== -1) {
            loadedColumns[colIndex].items.push(card);
          }
        });

        setColumns(loadedColumns);
      } catch (error) {
        console.error("Erreur de chargement des cartes :", error);
      }
    };

    fetchCards();
  }, []);


  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
  
    const updated = [...columns];
    const [movedItem] = updated[source.droppableId].items.splice(source.index, 1);
    updated[destination.droppableId].items.splice(destination.index, 0, movedItem);
    setColumns(updated);
  };
  

  return (
    <>
    <Search setFilteredColumn={setFilteredColumn} 
    setSearchText={setSearchText}
    columns={columns}/>
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
       {/* <button className="btn btn-primary" onClick={handleAddNewItem} data-bs-dismiss="modal">Ajouter</button> */}
       {editItem && (
      <button className="btn btn-warning" onClick={handleUpdateItem} data-bs-dismiss="modal">
       Modifier
     </button>
      )}
    {!editItem && (
     <button className="btn btn-primary" onClick={handleAddNewItem} data-bs-dismiss="modal">
      Ajouter
    </button>
      )}

     </div>
   </div>
 </div>
</div>


<DragDropContext onDragEnd={onDragEnd}>
    <div className="row">
    {columns
            .filter(col => !filteredColumn || col.title === filteredColumn)
            .map((column, colIndex) => (
              <div key={colIndex} className="col-md-3 mb-3">
        <div className="card">
          <div className="card-header back fw-bold d-flex justify-content-between align-items-center">
            {column.title}
            <div>
              <span className="badge bg-secondary me-1">{column.items.length}</span>
              <button className="btn btn-sm btn-light me-1">+</button>
              <button className="btn btn-sm btn-light">⋯</button>
            </div>
          </div>
          <Droppable droppableId={`${colIndex}`}>
                    {provided => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="card-body p-2 back">
            {column.items
             .filter(item =>
            item.title.toLowerCase().includes(searchText.toLowerCase())
                 )
             .map((item, index) => (
              <Draggable key={item._id} draggableId={item._id} index={index}>
                              {providedDrag => (
                                <div
                                  ref={providedDrag.innerRef}
                                  {...providedDrag.draggableProps}
                                  {...providedDrag.dragHandleProps}
                                  className="card mb-3 shadow-sm border-0"
                                >
                <div className="card-body position-relative">
                   {/* Boutons Modifier & Supprimer */}
      <div className="position-absolute top-0 end-0 m-2">
        <button className="btn btn-sm btn-outline-primary me-1"
         onClick={() => handleEdit(item)} 
         data-bs-toggle="modal"
         data-bs-target="#editItemModal">
          <i className="bi bi-pencil"></i>
        </button>
        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item)}>
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
              )}
                            </Draggable>
            ))}
            {provided.placeholder}
          </div>
            )}
                  </Droppable>
        </div>
      </div>
    ))}
  </div> 
  </DragDropContext>
  </>
  )
}

export default Card