"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { setColumns, addColumn } from "../../redux/tableSlice";

export default function ManageColumns() {
  const columns = useSelector((state: RootState) => state.table.columns);
  const dispatch = useDispatch();
  const [localColumns, setLocalColumns] = useState<string[]>([...columns]);
  const [newColumn, setNewColumn] = useState("");

  const handleCheckboxChange = (col: string) => {
    setLocalColumns(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const handleAddColumn = () => {
    if (newColumn && !localColumns.includes(newColumn)) {
      setLocalColumns([...localColumns, newColumn]);
      dispatch(addColumn(newColumn));
      setNewColumn("");
    }
  };

  const handleSave = () => {
    dispatch(setColumns(localColumns));
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <h3>Manage Columns</h3>
      <div>
        {columns.map(col => (
          <label key={col} style={{ marginRight: "1rem" }}>
            <input
              type="checkbox"
              checked={localColumns.includes(col)}
              onChange={() => handleCheckboxChange(col)}
            />
            {col}
          </label>
        ))}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Add new column"
          value={newColumn}
          onChange={e => setNewColumn(e.target.value)}
        />
        <button onClick={handleAddColumn} style={{ marginLeft: "0.5rem" }}>
          Add
        </button>
      </div>

      <button onClick={handleSave} style={{ marginTop: "1rem" }}>
        Save Columns
      </button>
    </div>
  );
}
