export type MedicalDocument = {
  id: string;
  title: string;
  createdAt?: string;
  status?: "uploaded" | "processing" | "reviewed";
};
