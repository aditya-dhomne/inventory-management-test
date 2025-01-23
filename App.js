import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CategoryManagement from "./category-managment";
import AddEditItem from "./AddEditItem";
import Navbar from "./Navbar";
import InventorySummary from "./inventory-list";

function App() {
  const [items, setItems] = useState([
    { id: 1, name: "Smartphone", category: "Electronics", price: 699.99, quantity: 10, details: { warrantyPeriod: 24 } },
    { id: 2, name: "Bananas", category: "Grocery", price: 0.99, quantity: 50, details: { expiryDate: "2025-02-15" } },
  ]);

  const handleItemSubmit = (itemData) => {
    if (itemData.id) {
      setItems(items.map((item) => (item.id === itemData.id ? itemData : item)));
    } else {
      setItems([...items, { ...itemData, id: items.length + 1 }]);
    }
  };

  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/category-management" element={<CategoryManagement items={items} />} />
          <Route path="/InventorySummary" element={<InventorySummary />} />
          <Route path="/add-item" element={<AddEditItem items={items} onSubmit={handleItemSubmit} actionType="Add" />} />
          <Route path="/edit-item/:id" element={<AddEditItem items={items} onSubmit={handleItemSubmit} actionType="Edit" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
