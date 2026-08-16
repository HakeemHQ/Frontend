import { z } from "zod";

export const createDoctorSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name is too long").trim(),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address").trim(),
  specialty: z.string().min(1, "Please select a medical specialty"),
  temporaryPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
    .trim(),
});

export type CreateDoctorFormValues = z.infer<typeof createDoctorSchema>;
export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;

export const dateRangeSchema = z.object({
  fromDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  toDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
}).refine(data => data.fromDate <= data.toDate, {
  message: "From Date cannot be after To Date",
  path: ["fromDate"],
});
