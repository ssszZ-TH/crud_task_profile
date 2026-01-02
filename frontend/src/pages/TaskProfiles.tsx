import { useState, useEffect } from "react";
import { Box, Container, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getTaskProfiles, TaskProfile } from "../services/taskProfile";
import DataTable from "../components/DataTable";
import AppBarCustom from "../components/AppBarCustom";
import UpdateButton from "../components/buttons/UpdateButton";
import AddButton from "../components/buttons/AddButton";
import Loading from "../components/Loading";
import { GridColDef } from "@mui/x-data-grid";
import { formatDateTimeThai, formatDateThai } from "../utils/time_util";
import LogButton from "../components/buttons/LogButton";

export default function TaskProfiles() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<TaskProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const data = await getTaskProfiles();
        if (Array.isArray(data)) {
          setProfiles(data);
          setError(null);
        } else {
          setError("ข้อมูลที่ได้รับไม่ถูกต้อง");
        }
      } catch (err: any) {
        setError(err.message || "ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <UpdateButton onClick={() => navigate(`/taskprofile/${params.id}`)} />
      ),
    },
    { field: "id", headerName: "ID", width: 80 },
    { field: "title", headerName: "Task Title", width: 250 },
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
      width: 200,
      valueFormatter: (value) => value || "-",
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
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
      field: "birth_date",
      headerName: "Birth Date",
      width: 130,
      valueFormatter: (value) => formatDateThai(value),
    },
    {
      field: "create_at",
      headerName: "Created At",
      width: 180,
      valueFormatter: (value) => formatDateTimeThai(value),
    },
    {
      field: "update_at",
      headerName: "Updated At",
      width: 180,
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
      <AppBarCustom title="Task Profiles" />
      <Container maxWidth="xl" sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" sx={{ color: "text.primary" }}>
            รายการ Task ทั้งหมด
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <LogButton /> {/* ปุ่มดู Log ใหม่ */}
            <AddButton onClick={() => navigate("/taskprofile/create")} />
          </Box>
        </Box>
        {loading ? (
          <Loading />
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        ) : (
          <Box sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
            <DataTable
              columns={columns}
              rows={profiles}
              getRowId={(row) => row.id}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
