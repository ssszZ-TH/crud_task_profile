import { useState, useEffect } from "react";
import { Box, Container, Typography, Alert } from "@mui/material";
import { getTaskProfileLogs, TaskProfileLog } from "../services/taskProfileLog";
import DataTable from "../components/DataTable";
import AppBarCustom from "../components/AppBarCustom";
import Loading from "../components/Loading";
import { GridColDef } from "@mui/x-data-grid";
import { formatDateThai, formatDateTimeThai } from "../utils/time_util";
import HomeButton from "../components/buttons/HomeButton";

export default function TaskProfileLogs() {
  const [logs, setLogs] = useState<TaskProfileLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await getTaskProfileLogs();
        if (Array.isArray(data)) {
          setLogs(data);
          setError(null);
        } else {
          setError("Invalid data received");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load logs");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "Log ID", width: 90 },
    {
      field: "task_profile_id",
      headerName: "Task ID",
      width: 90,
      valueFormatter: (value) => value || "-",
    },
    { field: "title", headerName: "Task Title", width: 250 },
    {
      field: "detail",
      headerName: "Detail",
      width: 300,
      valueFormatter: (value) => value || "-",
    },
    { field: "fname", headerName: "First Name", width: 120 },
    { field: "lname", headerName: "Last Name", width: 120 },
    {
      field: "phone_num",
      headerName: "Phone",
      width: 140,
      valueFormatter: (value) => value || "-",
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
      valueFormatter: (value) => value || "-",
    },
    {
      field: "birth_date",
      headerName: "Birth Date",
      width: 130,
      valueFormatter: (value) => (value ? formatDateThai(value) : "-"),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <Box
          sx={{
            fontWeight: "bold",
            color:
              params.value === "active"
                ? "#2e7d32"
                : params.value === "inactive"
                ? "#ed6c02"
                : "#1e88e5",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <Box
          sx={{
            fontWeight: "bold",
            color:
              params.value === "create"
                ? "#2e7d32" // เขียว
                : params.value === "update"
                ? "#ed6c02" // ส้ม
                : "#d32f2f", // แดง
          }}
        >
          {params.value.toUpperCase()}
        </Box>
      ),
    },
    {
      field: "action_at",
      headerName: "Action Time",
      width: 200,
      valueFormatter: (value) => formatDateTimeThai(value),
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBarCustom title="Task Profile Logs" />
      <Container maxWidth="xl" sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            mt: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <HomeButton />
            <Typography variant="h4" sx={{ color: "text.primary" }}>
              All Task Profile History Logs
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Loading />
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <Box sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
            <DataTable
              columns={columns}
              rows={logs}
              getRowId={(row) => row.id}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
