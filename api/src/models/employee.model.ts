export type AddEmployeeReq = {
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  email: string;
};

export type UpdateEmployeeReq = {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  email: string;
};
