import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export interface TaskProfileLog {
  id: number;
  task_profile_id: number | null;
  title: string;
  detail: string | null;
  fname: string;
  lname: string;
  phone_num: string | null;
  email: string | null;
  birth_date: string | null;
  status: 'active' | 'inactive' | 'done';
  action: 'create' | 'update' | 'delete';
  action_at: string;
}

export const getTaskProfileLogs = async (): Promise<TaskProfileLog[]> => {
  const response = await axios.get(`${BASE_URL}/taskprofilelog`);
  return response.data;
};