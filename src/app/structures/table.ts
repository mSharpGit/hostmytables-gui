export class Table {
	id: number;
	floor_id: number;
	table_number: number;
	table_name: string;
	shape: string;
	height: number;
	width: number;
	diameter: number;
	xloc: number;
	yloc: number;
	start_date: string;
	end_date: string;
	min_chairs: number;
	max_chairs: number;
	add_date: string;

	constructor() {
		this.id= 0;
		this.floor_id = 0;
		this.table_number = 0;
		this.table_name = "";
		this.shape = "";
		this.height = 0;
		this.width = 0;
		this.diameter = 0;
		this.xloc = 0;
		this.yloc = 0;
		this.start_date  = "";
		this.end_date  = "";
		this.min_chairs = 0;
		this.max_chairs = 0;
		this.add_date = "";

	}
}

export class Tableid {
	id: number;
	constructor(id) {
		this.id = id;
	}
}
 //table	{customerID: 1,tableID:11,type:'bar',time:'2',status:'1',	guestsNumber: 10,notes: 'reserved',duration: '2h',waiterID: 1,addDate: '2019-01-02'}