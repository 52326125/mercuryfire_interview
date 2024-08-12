export interface User {
  id: string;
  name: string;
  age: number;
}

export interface CreateUserPayload {
  name: string;
  age: number;
}

export type UpdateUserPayload = CreateUserPayload;

export type IdPayload = {
  id: string;
};
