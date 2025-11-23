export interface Leave {
  id: number;
  employeeName: string;   // from backend (Employee.FullName)
  startDate: string;
  endDate: string;
  reason: string;
  status: string;

  //  Add this line  ike use for displaying employee name from nested object
  // api jason file retuen all employee data but  than directly not diplay in html filr for that use below code
  // <td> {{ leave.employee?.fullName || '—' }}</td>
  employee?: {
    id: number;
    fullName: string;
    email: string;
    mobile: string;
    designation: string;
    // add others if needed
  };
}
