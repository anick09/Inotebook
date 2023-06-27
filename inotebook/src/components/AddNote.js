import React, { useContext, useState } from 'react'
import noteContext from "../context/notes/NotesContext";
const AddNote = () => {
    const context = useContext(noteContext);
    const {addNote} = context;
    const [note,setNote]=useState({title: "",description:"",tag:""})
    
    const handleClick=(e) => {
        e.preventDefault();
        addNote(note);
    }

    const onChange=(e)=>{
        setNote({...note,[e.target.name]:e.target.value});
    }

  return (
    <div>
      <div>
        <h2>Add Note</h2>
      </div>
      <div className="form">
        <form>
          <div className="form-group my-3">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              aria-describedby="emailHelp"
              placeholder="Title"
              onChange={onChange}
            />
          </div>
          <div className="form-group my-3">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              placeholder="description"
              onChange={onChange}
            />
          </div>
          <button type="submit" className="btn btn-primary my-3" onClick={handleClick}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNote;
