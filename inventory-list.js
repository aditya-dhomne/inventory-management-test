import React, { useEffect, useState } from "react";

const InventorySummary = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await fetch("http://localhost:3000/inventory");
        const data = await response.json();
        setInventoryData(data);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      }
    };

    fetchInventoryData();
  }, []);

  useEffect(() => {
    const groupedItems = inventoryData.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { itemCount: 0, totalValue: 0 };
      }

      acc[item.category].itemCount += item.quantity;
      acc[item.category].totalValue += item.price * item.quantity;

      return acc;
    }, {});

    setSummary(groupedItems);
  }, [inventoryData]);

  return (
    <div>
      <h2>Inventory Summary</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Item Count</th>
            <th>Total Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(summary).map((category) => (
            <tr key={category}>
              <td>{category}</td>
              <td>{summary[category].itemCount}</td>
              <td>${summary[category].totalValue.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventorySummary;
