export class Customer {
	id: number;
	restaurant_id: number;
	title: string;
	name: string;
	lastname: string;
	email: string;
	phone: string;
	birth_date: string;
	company: string;
	job_title: string;
	status: string;
	sex: string;
	notes: string;
	addDate: string;

	constructor(){
		this.id = 0;
		this.restaurant_id = 0;
		this.title= "";
		this.name = "";
		this.lastname = "";
		this.email ="";
		this.phone = "";
		this.birth_date = "";
		this.company = "";
		this.job_title = "";
		this.status = "";
		this.sex = "";
		this.notes = "";
		this.addDate = "";
	}
}

export class FoodRestrictions {
	id: number;
	food_type: string;
}

export class FoodRestrictionLink {
	id: number;
	customer_id: number;
	restriction_id: number;
}

export class FoodAllergies {
	id: number;
	food_type: string;
}

export class FoodAllergyLink {
	id: number;
	customer_id: number;
	allergy_id: number;
}