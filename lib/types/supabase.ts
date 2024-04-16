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

// export interface Order {
//   id: number;
//   order_by: number;
//   medicine_id: number;
//   status: 'pending' | 'delivering' | 'done';
//   address: string;
// }
