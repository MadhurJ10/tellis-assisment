import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TableState {
  data: any[];
  columns: string[];
}

const initialState: TableState = {
  data: [
    { Name: "John", Email: "john@example.com", Age: 25, Role: "Admin" },
    { Name: "Jane", Email: "jane@example.com", Age: 30, Role: "User" },
    { Name: "Aman", Email: "aman@example.com", Age: 22, Role: "Manager" },
  ],
  columns: ["Name", "Email", "Age", "Role"],
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setTableData: (state, action: PayloadAction<any[]>) => {
      state.data = action.payload;
    },
    addRow: (state, action: PayloadAction<any>) => {
      state.data.push(action.payload);
    },
    updateRow: (state, action: PayloadAction<{ index: number; newRow: any }>) => {
      state.data[action.payload.index] = action.payload.newRow;
    },
    deleteRow: (state, action: PayloadAction<number>) => {
      state.data.splice(action.payload, 1);
    },
    setColumns: (state, action: PayloadAction<string[]>) => {
      state.columns = action.payload;
    },
    addColumn: (state, action: PayloadAction<string>) => {
      if (!state.columns.includes(action.payload)) state.columns.push(action.payload);
    },
  },
});

export const { setTableData, addRow, updateRow, deleteRow, setColumns, addColumn } = tableSlice.actions;
export default tableSlice.reducer;
