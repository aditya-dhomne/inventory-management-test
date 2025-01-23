import React from "react";
import DynamicForm from "./DynamicForm";

function AddEditItem({ items, onSubmit, actionType }) {
  const handleFormSubmit = (formData) => {
    onSubmit(formData);
  };

  return (
    <div>
      <h2>{actionType} Item</h2>
      <DynamicForm
        onSubmit={handleFormSubmit}
        actionType={actionType}
      />
    </div>
  );
}

export default AddEditItem;
