import React, { useState } from "react";

export default function TodoApp() {
  // State to store the list of todos
  const [todos, setTodos] = useState([]);
  // State to store the current input value
  const [inputValue, setInputValue] = useState("");

  // Function to handle adding a new todo
  const addTodo = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return; // Prevent adding empty todos

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue(""); // Clear the input field
  };

  // Function to toggle completion status
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  // Function to delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "20px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>My Todo List</h2>

      {/* Form to add items */}
      <form
        onSubmit={addTodo}
        style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task..."
          style={{ flex: 1, padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Add
        </button>
      </form>

      {/* List display */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              borderBottom: "1px solid #ccc",
              textDecoration: todo.completed ? "line-through" : "none",
              color: todo.completed ? "#888" : "#000",
            }}
          >
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{ cursor: "pointer", flex: 1 }}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                background: "#ff4d4d",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
