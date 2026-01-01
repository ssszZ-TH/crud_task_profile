// src/pages/TaskProfileDetail.tsx (ภาษาอังกฤษ + Validation + DatePicker)
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Alert,
  FormHelperText,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTaskProfileById,
  createTaskProfile,
  updateTaskProfile,
  deleteTaskProfile,
} from "../services/taskProfile";
import AppBarCustom from "../components/AppBarCustom";
import SaveButton from "../components/buttons/SaveButton";
import CancelButton from "../components/buttons/CancelButton";
import DeleteButton from "../components/buttons/DeleteButton";
import Loading from "../components/Loading";

export default function TaskProfileDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isCreateMode = id === "create" || id === undefined;

  const [loading, setLoading] = useState(!isCreateMode);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    detail: "",
    fname: "",
    lname: "",
    phone_num: "",
    email: "",
    birth_date: null as Dayjs | null,
    status: "active" as "active" | "inactive" | "done",
  });

  const [fieldErrors, setFieldErrors] = useState({
    phone_num: "",
    email: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (isCreateMode) {
        setLoading(false);
        return;
      }

      if (id && !isNaN(Number(id))) {
        try {
          const data = await getTaskProfileById(Number(id));
          setFormData({
            title: data.title || "",
            detail: data.detail || "",
            fname: data.fname || "",
            lname: data.lname || "",
            phone_num: data.phone_num || "",
            email: data.email || "",
            birth_date: data.birth_date ? dayjs(data.birth_date) : null,
            status: data.status,
          });
        } catch (err: any) {
          setError("Failed to load data");
        } finally {
          setLoading(false);
        }
      } else {
        setError("Invalid ID");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, isCreateMode]);

  const validatePhone = (value: string) => {
    // ลบช่องว่าง, ขีด, เครื่องหมาย + (ยกเว้นนำหน้า), และวงเล็บ
    const cleaned = value.replace(/[\s\-\(\)]/g, "").replace(/^\+/, "");

    // รองรับเบอร์ทั่วโลก: ต้องมีอย่างน้อย 7-15 หลัก และเป็นตัวเลขเท่านั้น
    const phoneRegex = /^\d{7,15}$/;

    return phoneRegex.test(cleaned) || value.trim() === "";
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || value === "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    if (name === "phone_num") {
      setFieldErrors((prev) => ({
        ...prev,
        phone_num: validatePhone(value)
          ? ""
          : "Invalid phone format (e.g. +66812345678)",
      }));
    }
    if (name === "email") {
      setFieldErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Invalid email address",
      }));
    }
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    setFormData((prev) => ({ ...prev, birth_date: newValue }));
  };

  const handleSubmit = async () => {
    setError(null);

    // Final validation
    if (
      !formData.title.trim() ||
      !formData.fname.trim() ||
      !formData.lname.trim()
    ) {
      setError("Task Title, First Name, and Last Name are required");
      return;
    }

    if (formData.phone_num && !validatePhone(formData.phone_num)) {
      setFieldErrors((prev) => ({
        ...prev,
        phone_num: "Invalid phone format (e.g. +66812345678)",
      }));
      return;
    }

    if (formData.email && !validateEmail(formData.email)) {
      setFieldErrors((prev) => ({
        ...prev,
        email: "Invalid email address",
      }));
      return;
    }

    try {
      const cleanedData = {
        title: formData.title.trim(),
        detail: formData.detail.trim() || null,
        fname: formData.fname.trim(),
        lname: formData.lname.trim(),
        phone_num: formData.phone_num.trim() || null,
        email: formData.email.trim() || null,
        birth_date: formData.birth_date
          ? formData.birth_date.format("YYYY-MM-DD")
          : null,
        status: formData.status,
      };

      if (isCreateMode) {
        await createTaskProfile(cleanedData);
      } else if (id && !isNaN(Number(id))) {
        await updateTaskProfile(Number(id), cleanedData);
      }

      navigate("/");
    } catch (err: any) {
      console.error("Save error:", err);
      setError(err.response?.data?.detail || "Error saving data");
    }
  };

  const handleDelete = async () => {
    if (!id || isNaN(Number(id))) return;
    try {
      await deleteTaskProfile(Number(id));
      navigate("/");
    } catch (err) {
      setError("Failed to delete");
    }
  };

  if (loading) return <Loading />;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <AppBarCustom
          title={isCreateMode ? "Create New Task Profile" : "Edit Task Profile"}
        />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
              {isCreateMode ? "Create New Task Profile" : "Edit Task Profile"}
            </Typography>

            <TextField
              label="Task Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Task Detail"
              name="detail"
              value={formData.detail}
              onChange={handleChange}
              fullWidth
              multiline
              rows={7}
              margin="normal"
            />
            <TextField
              label="First Name"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Last Name"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Phone Number"
              name="phone_num"
              value={formData.phone_num}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder="+662345657890"
              error={!!fieldErrors.phone_num}
              helperText={fieldErrors.phone_num}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
            />
            <DesktopDatePicker
              label="Birth Date"
              value={formData.birth_date}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                },
              }}
            />
            <TextField
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="active">active</MenuItem>
              <MenuItem value="inactive">inactive</MenuItem>
              <MenuItem value="done">done</MenuItem>
            </TextField>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Box
              sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}
            >
              <CancelButton onClick={() => navigate("/")} />
              <Box>
                {!isCreateMode && <DeleteButton onClick={handleDelete} />}
                <SaveButton onClick={handleSubmit} />
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </LocalizationProvider>
  );
}
