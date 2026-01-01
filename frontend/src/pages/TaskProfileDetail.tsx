import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, TextField, MenuItem, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getTaskProfileById,
  createTaskProfile,
  updateTaskProfile,
  deleteTaskProfile,
} from '../services/taskProfile';
import AppBarCustom from '../components/AppBarCustom';
import SaveButton from '../components/buttons/SaveButton';
import CancelButton from '../components/buttons/CancelButton';
import DeleteButton from '../components/buttons/DeleteButton';
import Loading from '../components/Loading';

export default function TaskProfileDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // /taskprofile/create หรือ /taskprofile/undefined → create mode
  const isCreateMode = id === 'create' || id === undefined;

  const [loading, setLoading] = useState(!isCreateMode);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    detail: '',
    fname: '',
    lname: '',
    phone_num: '',
    email: '',
    birth_date: '',
    status: 'active' as 'active' | 'inactive' | 'done',
  });

  useEffect(() => {
    console.log('id from useParams = ', id);
    console.log('isCreateMode = ', isCreateMode);

    const fetchProfile = async () => {
      if (isCreateMode) {
        setLoading(false);
        return;
      }

      // ถ้าไม่ใช่ create และ id เป็นตัวเลข → edit mode
      if (id && !isNaN(Number(id))) {
        try {
          const data = await getTaskProfileById(Number(id));
          setFormData({
            title: data.title || '',
            detail: data.detail || '',
            fname: data.fname || '',
            lname: data.lname || '',
            phone_num: data.phone_num || '',
            email: data.email || '',
            birth_date: data.birth_date || '',
            status: data.status,
          });
        } catch (err: any) {
          setError('Failed to load data');
        } finally {
          setLoading(false);
        }
      } else {
        // ถ้า id ไม่ใช่ตัวเลขและไม่ใช่ 'create' → error
        setError('Invalid ID');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, isCreateMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (isCreateMode && (!formData.title.trim() || !formData.fname.trim() || !formData.lname.trim())) {
      setError('Task Title, First Name, and Last Name are required');
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
        birth_date: formData.birth_date.trim() || null,
        status: formData.status,
      };

      if (isCreateMode) {
        await createTaskProfile(cleanedData);
      } else if (id && !isNaN(Number(id))) {
        await updateTaskProfile(Number(id), cleanedData);
      }

      navigate('/');
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err.response?.data?.detail || 'Error saving data');
    }
  };

  const handleDelete = async () => {
    if (!id || isNaN(Number(id))) return;
    try {
      await deleteTaskProfile(Number(id));
      navigate('/');
    } catch (err) {
      setError('Failed to delete');
    }
  };

  if (loading) return <Loading />;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBarCustom title={isCreateMode ? "Create New Task Profile" : "Edit Task Profile"} />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            {isCreateMode ? 'Create New Task Profile' : 'Edit Task Profile'}
          </Typography>

          <TextField label="Task Title" name="title" value={formData.title} onChange={handleChange} fullWidth required margin="normal" />
          <TextField label="Task Detail" name="detail" value={formData.detail} onChange={handleChange} fullWidth multiline rows={3} margin="normal" />
          <TextField label="First Name" name="fname" value={formData.fname} onChange={handleChange} fullWidth required margin="normal" />
          <TextField label="Last Name" name="lname" value={formData.lname} onChange={handleChange} fullWidth required margin="normal" />
          <TextField label="Phone Number" name="phone_num" value={formData.phone_num} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Birth Date (YYYY-MM-DD)" name="birth_date" value={formData.birth_date} onChange={handleChange} fullWidth margin="normal" placeholder="1990-05-15" />
          <TextField select label="Status" name="status" value={formData.status} onChange={handleChange} fullWidth margin="normal">
            <MenuItem value="active">active</MenuItem>
            <MenuItem value="inactive">inactive</MenuItem>
            <MenuItem value="done">done</MenuItem>
          </TextField>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <CancelButton onClick={() => navigate('/')} />
            <Box>
              {!isCreateMode && <DeleteButton onClick={handleDelete} />}
              <SaveButton onClick={handleSubmit} />
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}