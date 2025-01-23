import React, { useState, useEffect } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const CategoryManagement = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await fetch("http://localhost:3000/inventory");
        const data = await response.json();
        setInventoryData(data);
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      }
    };

    fetchInventoryData();
  }, []);

  const handleFilter = () => {
    let filtered = [...inventoryData];

    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const handleSort = () => {
    const sortedData = [...filteredData];
    sortedData.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    setFilteredData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:3000/inventory/deleteItem/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedData = inventoryData.filter((item) => item.id !== itemId);
        setInventoryData(updatedData);
        setFilteredData(updatedData);
        alert("Item deleted successfully!");
      } else {
        alert("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Inventory Management</h2>

      {/* Filter and Search Section */}
      <div className="mb-3">
        <Form.Group controlId="categorySelect" className="mb-2">
          <Form.Label>Select Category</Form.Label>
          <Form.Control as="select" onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Grocery">Grocery</option>
            <option value="Clothing">Clothing</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="searchInput" className="mb-2">
          <Form.Label>Search Items</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by item name"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>

        <Button onClick={handleFilter} variant="primary">
          Apply Filters
        </Button>
        <Button onClick={() => setSearchTerm("")} variant="secondary" className="ml-2">
          Clear Filters
        </Button>
      </div>

      {/* Sort and Add Item Button */}
      <div className="mb-3 d-flex justify-content-between">
        <Button onClick={handleSort} variant="info">
          Sort by Price ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </Button>

        {/* Add New Item Button */}
        <Link to="/add-item">
          <Button variant="success">
            Add New Item
          </Button>
        </Link>
      </div>

      {/* Table of Items */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th> {/* Add Actions column for Delete button */}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>
                {/* Display "Low Stock" if quantity is less than 5 */}
                {item.quantity < 5 ? (
                  <span style={{ color: "red", fontWeight: "bold" }}>Low Stock!! Only {item.quantity} left</span>
                ) : (
                  item.quantity
                )}
              </td>
              <td>
                {/* Delete button */}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CategoryManagement;
