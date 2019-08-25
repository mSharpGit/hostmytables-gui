import { Floor } from './floor';
import { Section } from './section';
import { Table } from './table';
import { User } from './user';
import { Occupy } from './occupy';
import { Customer } from './customer';

export interface DialogData {
  id: number;
  name: string;
  lastname: string;
  code: string;
  phone: string;

}

export interface AddGuestDialogData {
  customer: Customer;
  type: string;
}

export interface AddReserveDialogData {
  occupy: Occupy;
  table: Table;
  customer: Customer;
  date: string;
  type: string;
}

/* export interface AddReserveDialogData {
  id: number;
  name: string;
  lastname: string;
  code: string;
  phone: string;
  floor: Floor;
  section: Section;
  table: Table;
  date: string;
  time: string;
  duration: String;
  waiter: User;
  minimum_spent: number;
  type: string;
} */


export interface title {
  id: number;
  value: string;
}

export interface code {
  countryCode: string;
  value: string;
  desc: string;
}