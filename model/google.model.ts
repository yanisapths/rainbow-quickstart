export interface GoogleRequest {
  accessToken: string;
}

export interface GoogleProfile {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  wallet?: string;
  team?: string;
  role?: string;
  bio?: string;
  displayName?: string;
  displayImage?: string;
  walletAddress?: string;
}

export interface GoogleResponse {
  code: number;
  message: string;
  data: GoogleProfile;
}
