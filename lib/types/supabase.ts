export type Tier = 's' | 'a' | 'b' | 'c' | 'd';
export type Profession =
  | 'assistant professor'
  | 'associate professor'
  | 'professor'
  | 'consultant'
  | 'specialist'
  | 'senior specialist';

export interface Medicines {
  id: number;
  title: string;
  price: number;
  type: 'tab' | 'cap' | 'syr' | 'gel' | 'drop';
}

export const MedTypeMap = {
  tab: 'Tablet',
  cap: 'Capsule',
  syr: 'Syrup',
  gel: 'Gel',
  drop: 'Drop',
};

export interface Order {
  id: number;
  medicine_id: number;
  medicine_name: string;
  added_by: [
    {
      id: number;
      name: string;
    },
  ];
  status: string;
  address: string;
  created_at: string;
}

export interface SimpleCardProps {
  id: number;
  userId?: number;
  title: string;
  item: number;
  medicine_id: number;
  medicine_name: string;
  address: string;
  status: string;
  visible?: boolean;
  order_box?: boolean;
  hasReminder?: boolean;
  reminder?: string | null;
  count?: number;
}

export interface BoxInfoProps {
  id: number;
  owned_by: number;
  medicine_id: number;
  medicine_name: string;
  count: number;
}

export interface EditMedecineProp {
  id: number;
  title: string;
  price: number;
  type: string;
  description: string;
}

export interface User {
  id: number;
  name: string;
}

export interface Doctor {
  id: number;
  created_at: string;
  name: string;
  available: true;
  specialty: string;
  sub_specialties?: string | null;
  hospital: string;
  degree: string;
  experience: number;
  phone_number?: string | null;
  grade: Tier;
  office_number?: string | null;
  fee: number;
  profession: Profession;
  days_of_week: string | null;
  start_time: string | null;
  end_time: string | null;
  limit: number | null;
  description: string | null;
}

export interface Appointment {
  appointment_id: number;
  doctor_id: number;
  patient_id: bigint;
  appointment_date: Date;
  appointment_time: string;
  reason?: string | null;
  status?: string | null;
}

export interface DoctorReview {
  review_id: number;
  doctor_id: number;
  patient_id: bigint;
  rate?: number | null;
  review_text?: string | null;
  review_date?: Date | null;
}

export interface Specialty {
  specialty: string;
  sub_specialties?: string[] | null;
}

export interface MedicalDegree {
  degree: string;
  category: Tier;
}
