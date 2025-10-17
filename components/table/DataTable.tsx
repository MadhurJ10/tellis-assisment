"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { setTableData } from "../../redux/tableSlice";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import ManageColumns from "./ManageColumns";

type SortConfig = { key: string; direction: "asc" | "desc" } | null;

export default function DataTable() {
  const rows = useSelector((state: RootState) => state.table.data);
  const columns = useSelector((state: RootState) => state.table.columns);
  const dispatch = useDispatch();

  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") direction = "desc";

    const sortedData = [...rows].sort((a, b) => {
      if (a[key as keyof typeof a] < b[key as keyof typeof b]) return direction === "asc" ? -1 : 1;
      if (a[key as keyof typeof a] > b[key as keyof typeof b]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    dispatch(setTableData(sortedData));
    setSortConfig({ key, direction });
  };

  const filteredRows = rows.filter(row =>
    columns.some(col => String(row[col as keyof typeof row]).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCSVImport = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => dispatch(setTableData(results.data)),
      error: () => alert("Invalid CSV file"),
    });
  };

  const handleCSVExport = () => {
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "table_export.csv");
  };

  return (
    <>
      <ManageColumns />

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: "8px", width: "200px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input type="file" accept=".csv" onChange={e => e.target.files?.[0] && handleCSVImport(e.target.files[0])} />
        <button onClick={handleCSVExport} style={{ padding: "8px 16px" }}>Export CSV</button>
      </div>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell key={index} onClick={() => handleSort(col)} sx={{ cursor: "pointer", fontWeight: "bold" }}>
                  {col} {sortConfig?.key === col ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((col, i) => (
                  <TableCell key={i}>{row[col as keyof typeof row]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredRows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </>
  );
}
