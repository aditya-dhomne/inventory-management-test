const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

const inventoryData = [
  {
    id: 1,
    name: "Smartphone",
    quantity: 10,
    price: 699.99,
    category: "Electronics",
    details: { warrantyPeriod: 24 },
  },
  {
    id: 2,
    name: "LED TV",
    quantity: 5,
    price: 1200.49,
    category: "Electronics",
    details: { warrantyPeriod: 36 },
  },
  {
    id: 3,
    name: "Apples",
    quantity: 50,
    price: 0.99,
    category: "Grocery",
    details: { expiryDate: "2025-02-15" },
  },
  {
    id: 4,
    name: "Bananas",
    quantity: 30,
    price: 0.49,
    category: "Grocery",
    details: { expiryDate: "2025-01-25" },
  },
  {
    id: 5,
    name: "T-Shirt",
    quantity: 20,
    price: 15.99,
    category: "Clothing",
    details: { size: "M", material: "Cotton" },
  },
  {
    id: 6,
    name: "Jeans",
    quantity: 15,
    price: 45.99,
    category: "Clothing",
    details: { size: "L", material: "Denim" },
  },
];

app.get("/inventory", (req, res) => {
  const search = req.query.search ? req.query.search.toLowerCase() : "";

  if (search) {
    const filteredItems = inventoryData.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search)
    );

    res.json(filteredItems);
  } else {
    res.json(inventoryData);
  }
});

app.get("/inventory/:id", (req, res) => {
  const item = inventoryData.find((i) => i.id === parseInt(req.params.id));
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

app.get("/inventory/category/:category", (req, res) => {
  const categoryItems = inventoryData.filter(
    (item) => item.category.toLowerCase() === req.params.category.toLowerCase()
  );
  res.json(categoryItems);
});

app.post("/inventory/addItem", (req, res) => {
  const { name, quantity, price, category, details } = req.body;

  if (!name || !quantity || !price || !category || !details) {
    return res.status(400).json({
      message:
        "All fields (name, quantity, price, category, and details) are required.",
    });
  }

  const existingItem = inventoryData.find(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );

  if (existingItem) {
    return res.status(400).json({
      message: `Item with the name "${name}" already exists.`,
    });
  }

  const newItem = {
    id: inventoryData.length + 1,
    name,
    quantity,
    price,
    category,
    details,
  };

  inventoryData.push(newItem);

  res.status(201).json({ message: "Item added successfully", item: newItem });
});

app.put("/inventory/updateItem/:id", (req, res) => {
  const { id } = req.params;
  const { name, quantity, price, category, details } = req.body;

  if (!name || !quantity || !price || !category || !details) {
    return res.status(400).json({
      message:
        "All fields (name, quantity, price, category, and details) are required.",
    });
  }

  const existingItem = inventoryData.find((item) => item.id === parseInt(id));

  if (!existingItem) {
    return res.status(404).json({ message: "Item not found" });
  }

  const duplicateItem = inventoryData.find(
    (item) =>
      item.name.toLowerCase() === name.toLowerCase() && item.id !== parseInt(id)
  );

  if (duplicateItem) {
    return res.status(400).json({
      message: `Item with the name "${name}" already exists.`,
    });
  }

  existingItem.name = name;
  existingItem.quantity = quantity;
  existingItem.price = price;
  existingItem.category = category;
  existingItem.details = details;

  res
    .status(200)
    .json({ message: "Item updated successfully", item: existingItem });
});

app.delete("/inventory/deleteItem/:id", (req, res) => {
  const { id } = req.params;

  const itemIndex = inventoryData.findIndex((item) => item.id === parseInt(id));

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  inventoryData.splice(itemIndex, 1);

  res.status(200).json({ message: "Item deleted successfully" });
});

app.delete("/inventory/deleteItem/:id", (req, res) => {
  const { id } = req.params;

  const itemIndex = inventoryData.findIndex((item) => item.id === parseInt(id));

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  inventoryData.splice(itemIndex, 1);

  res.status(200).json({ message: "Item deleted successfully" });
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
