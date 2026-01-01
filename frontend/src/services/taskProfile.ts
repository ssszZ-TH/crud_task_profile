import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export interface TaskProfile {
  id: number;
  title: string;
  detail: string | null;
  fname: string;
  lname: string;
  phone_num: string | null;
  email: string | null;
  birth_date: string | null;
  status: 'active' | 'inactive' | 'done';
  create_at: string;
  update_at: string;
}

export interface TaskProfileCreate {
  title: string;
  detail?: string | null;
  fname: string;
  lname: string;
  phone_num?: string | null;
  email?: string | null;
  birth_date?: string | null;
  status: 'active' | 'inactive' | 'done';
}

export interface TaskProfileUpdate {
  title?: string;
  detail?: string | null;
  fname?: string;
  lname?: string;
  phone_num?: string | null;
  email?: string | null;
  birth_date?: string | null;
  status?: 'active' | 'inactive' | 'done';
}

export const createTaskProfile = async (data: TaskProfileCreate): Promise<TaskProfile> => {
  console.log('will create task profile data = ',data);
  const response = await axios.post(`${BASE_URL}/taskprofile`, data);
  return response.data;
};

export const getTaskProfiles = async (): Promise<TaskProfile[]> => {
  const response = await axios.get(`${BASE_URL}/taskprofile`);
  console.log('fetched task profile data = ',response.data);
  return response.data;
};

export const getTaskProfileById = async (id: number): Promise<TaskProfile> => {
  const response = await axios.get(`${BASE_URL}/taskprofile/${id}`);
  console.log('fetched task profile data = ',response.data);
  return response.data;
};

export const updateTaskProfile = async (id: number, data: TaskProfileUpdate): Promise<TaskProfile> => {
  console.log('will update task profile data = ',data);
  const response = await axios.put(`${BASE_URL}/taskprofile/${id}`, data);
  return response.data;
};

export const deleteTaskProfile = async (id: number): Promise<{ message: string; id: number }> => {
  console.log('will delete task profile id = ',id);
  const response = await axios.delete(`${BASE_URL}/taskprofile/${id}`);
  return response.data;
};