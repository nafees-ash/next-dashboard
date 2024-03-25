export interface Medicines {
  id: number;
  title: string;
  price: number;
  type: 'tab' | 'cap' | 'syr' | 'gel';
}

export const MedTypeMap = {
  tab: 'Tablet',
  cap: 'Capsule',
  syr: 'Syrup',
  gel: 'Gel',
};
