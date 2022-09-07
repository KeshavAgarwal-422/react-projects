import React, { useState, useEffect } from "react";
import Alert from "./Alert";
import List from "./List";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return (list = JSON.parse(localStorage.getItem("list")));
  } else {
    return [];
  }
};

const App = () => {
  const [name, setName] = useState("");
  const [alert, setAlert] = useState({ show: false, msg: " ", type: " " });
  const [list, setList] = useState(getLocalStorage);
  const [edit, setEdit] = useState(null);
  const [editing, isEditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, "Please Enter the value", "danger");
    } else if (name && editing) {
      setList(
        list.map((item) => {
          if (item.id === edit) {
            return { ...item, title: name };
          } else {
            return item;
          }
        })
      );
      setName("");
      setEdit(null);
      isEditing(false);
      showAlert(true, "Successfully added", "success");
    } else {
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      showAlert(true, "Item added", "success");
    }
  };

  const showAlert = (show = false, msg = "", type = "") => {
    setAlert({ show, msg, type });
  };

  const clearAll = () => {
    setList([]);
  };

  const removeItem = (id) => {
    showAlert(true, "Item removed", "danger");
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setEdit(id);
    isEditing(true);
    setName(specificItem.title);
  };
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);
  return (
    <>
      <section className="section-center">
        <form onSubmit={handleSubmit} className="grocery-form">
          {alert.show && (
            <Alert {...alert} removeAlert={showAlert} list={list}></Alert>
          )}
          <h3>Grocery Bud</h3>
          <div className="form-control">
            <input
              className="grocery"
              type="text"
              placeholder="This is input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button type="submit" className="submit-btn">
              {editing ? "Edit" : "Submit"}
            </button>
          </div>
        </form>
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem}></List>
        </div>
        <button type="btn" className="clear-btn" onClick={clearAll}>
          Clear All
        </button>
      </section>
    </>
  );
};

export default App;
