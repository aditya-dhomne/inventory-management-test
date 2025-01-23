import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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

      <Button variant="primary" type="submit">
        {actionType} Item
      </Button>
    </Form>
  );
}

export default DynamicForm;
