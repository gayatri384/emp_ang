export interface Department {
  id: number;
  departmentName: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Employee {
  id: number;
  fullName: string;
  email: string;
  password: string;
  mobile: string;
  address: string;
  gender: string;
  dateOfBirth: string;
  departmentId?: number;   // ✅ Add this
  department?: any;   // ✅ CHANGE THIS LINE
  designation: string;
  joiningDate: string;
  salary: number;
  role: string;
  isActive: boolean;
  isverify: boolean;
  otp?: string;
  sessionId?: string;
  createdAt?: string;
  updatedAt?: string | null;
}
