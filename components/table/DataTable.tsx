"use client";

import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";

const columns = ["Name", "Email", "Age", "Role"];

export default function DataTable() {
  const [rows, setRows] = useState([
    { Name: "John", Email: "john@example.com", Age: 25, Role: "Admin" },
    { Name: "Jane", Email: "jane@example.com", Age: 30, Role: "User" },
    { Name: "Aman", Email: "aman@example.com", Age: 22, Role: "Manager" },
    { Name: "Riya", Email: "riya@example.com", Age: 27, Role: "User" },
    { Name: "Arjun", Email: "arjun@example.com", Age: 35, Role: "Admin" },
    { Name: "Simran", Email: "simran@example.com", Age: 24, Role: "User" },
    { Name: "Rohan", Email: "rohan@example.com", Age: 29, Role: "Manager" },
    { Name: "Isha", Email: "isha@example.com", Age: 31, Role: "User" },
    { Name: "Vikram", Email: "vikram@example.com", Age: 26, Role: "Admin" },
    { Name: "Kavya", Email: "kavya@example.com", Age: 28, Role: "User" },
    { Name: "Neha", Email: "neha@example.com", Age: 23, Role: "User" },
  ]);

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...rows].sort((a, b) => {
      if (a[key as keyof typeof a] < b[key as keyof typeof b]) return direction === "asc" ? -1 : 1;
      if (a[key as keyof typeof a] > b[key as keyof typeof b]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setRows(sortedData);
    setSortConfig({ key, direction });
  };

  const filteredRows = rows.filter((row) =>
    columns.some((col) =>
      String(row[col as keyof typeof row])
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            width: "100%",
            maxWidth: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell
                  key={index}
                  onClick={() => handleSort(col)}
                  sx={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  {col}{" "}
                  {sortConfig?.key === col
                    ? sortConfig.direction === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
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
