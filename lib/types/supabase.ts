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
  medicine_id: number[];
  order_by: [
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
  title: string;
  items: number[];
  address: string;
  status: string;
}

export interface EditMedecineProp {
  id: number;
  title: string;
  price: number;
  type: string;
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
