import { z } from "zod";

// --- VALIDATION PATTERNS ---
const phoneRegex = /^(09|\+639)\d{9}$/;

// --- USER REGISTRATION SCHEMA ---
export const RegisterSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    // FIX: Removed the errorMap config object to fix the overload error.
    // Added 'as const' to ensure it's treated as a tuple.
    gender: z.enum(["male", "female", "other"] as const),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().regex(phoneRegex, "Invalid PH phone number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(
        /[0-9!@#$%^&*]/,
        "Password must contain at least one number or special char"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// --- ADMIN: STAFF SCHEMA ---
export const StaffSchema = z.object({
  employee_id: z.string().min(1, "Employee ID is required"),
  full_name: z.string().min(2, "Full Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(phoneRegex, "Invalid PH phone number"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  // FIX: Added 'as const'
  status: z.enum(["active", "inactive", "terminated"] as const),
  salary: z.coerce.number().min(0, "Salary cannot be negative"),
  hire_date: z.string().min(1, "Date is required"),
});

// --- ADMIN: ROOM SCHEMA ---
export const RoomSchema = z.object({
  name: z.string().min(3, "Room name must be at least 3 characters"),
  base_price: z.coerce.number().min(1, "Price must be greater than 0"),
  total_rooms: z.coerce.number().int().min(1, "Must have at least 1 room"),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
  image_url: z.string().optional().or(z.literal("")),
  description: z.string().optional(),
});
