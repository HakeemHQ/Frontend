import { api } from "./axios";

export interface DoctorProfile {
  doctorId: string;
  fullName: string;
  email: string;
  specialty: string;
  licenseNumber: string;
  status: string;
}

export async function getDoctorProfile(): Promise<DoctorProfile> {
  const { data } = await api.get<DoctorProfile>("/doctor/profile");
  return data;
}
