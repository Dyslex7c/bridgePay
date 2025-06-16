export interface Employee {
    _id?: string
    name: string
    walletAddress: string
    preferredChain: string
    monthlySalary: number
    createdAt?: Date
    updatedAt?: Date
  }
  
  export interface CreateEmployeeRequest {
    name: string
    walletAddress: string
    preferredChain: string
    monthlySalary: number
  }
  
  export interface UpdateEmployeeRequest extends CreateEmployeeRequest {
    _id: string
  }
  