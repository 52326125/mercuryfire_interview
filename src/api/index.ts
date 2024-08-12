import { api } from 'src/boot/axios';
import {
  CreateUserPayload,
  IdPayload,
  UpdateUserPayload,
  User,
} from 'src/interface/api';

export const getUserTable = async () => {
  return await api.get<User[]>('/api/CRUDTest/a');
};

export const createUser = async (payload: CreateUserPayload) => {
  return await api.post('/api/CRUDTest', payload);
};

export const updateUser = async (payload: UpdateUserPayload) => {
  return await api.patch('/api/CRUDTest', payload);
};

export const deleteUser = async ({ id }: IdPayload) => {
  return await api.delete(`/api/CRUDTest/${id}`);
};
