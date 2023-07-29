type TPersonnel = {
  id: number;
  name: string;
  nationalID: string;
  DoB: string;
  gender: boolean;
  phone: string;
};

type TStaff = {
  personnelID: number;
  name: string;
};

type TResponse = {
  statusCode: number;
  data: any;
};
