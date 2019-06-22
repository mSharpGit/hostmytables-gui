import { Role } from './role';

export class User {
	id: number;
	Restaurant_id: number;
    name: string;
	surname:    string;
	birthdate:   string;
	sex:   string;
	password:   string;
	email:      string;
	address:    string;
	city:       string;
	country:    string;
	postalcode: string;
	confirmed:  number;
	verifycode: string;
	role: Role;
	manager_id:  number;
	always_logged:  number;
	regdate:    string;
	token:any;
  }
