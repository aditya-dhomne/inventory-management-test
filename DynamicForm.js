import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const categoryFields = {
  Electronics: [
    { label: "Warranty Period (Months)", type: "number", name: "warrantyPeriod" },
  ],
  Grocery: [
    { label: "Expiry Date", type: "date", name: "expiryDate" },
  ],
  Clothing: [
    { label: "Size", type: "text", name: "size" },
    { label: "Material", type: "text", name: "material" },
  ],
};

function DynamicForm({ onSubmit, item = {}, actionType = "Add" }) {
  const [formData, setFormData] = useState({
    name: item.name || "",
    quantity: item.quantity || "",
    price: item.price || "",
    category: item.category || "",
    details: item.details || {},
  });

  const [selectedCategory, setSelectedCategory] = useState(item.category || "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setFormData({
      ...formData,
      category: category,
      details: {},
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newFormData = {
      ...formData,
      quantity: Number(formData.quantity),
      price: parseFloat(formData.price),
    };

    try {
      const response = await fetch("http://localhost:3000/inventory/addItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFormData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Item added successfully!");
        onSubmit(result.item);
      } else {
        alert("Failed to add item: " + result.message);
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Error adding item. Please try again.");
    }
  };

  const categorySpecificFields = categoryFields[selectedCategory] || [];

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="name">
        <Form.Label>Item Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="quantity">
        <Form.Label>Quantity</Form.Label>
        <Form.Control
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="price">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="category">
        <Form.Label>Category</Form.Label>
        <Form.Control
          as="select"
          name="category"
          value={formData.category}
          onChange={handleCategoryChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Grocery">Grocery</option>
          <option value="Clothing">Clothing</option>
        </Form.Control>
      </Form.Group>

      {categorySpecificFields.map((field) => (
        <Form.Group key={field.name} controlId={field.name}>
          <Form.Label>{field.label}</Form.Label>
          <Form.Control
            type={field.type}
            name={`details.${field.name}`}
            value={formData.details[field.name] || ""}
            onChange={handleChange}
          />
        </Form.Group>
      ))}

        <Link to="//category-management">
        <Button variant="primary" type="submit">
            {actionType} Item
        </Button>
        </Link>
      
    </Form>
  );
}

export default DynamicForm;
