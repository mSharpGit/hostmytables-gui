import { Component, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData, title, code } from 'src/app/structures/interfaces';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Globals } from 'src/app/structures/globals';
import { CustomerService } from 'src/app/services/customer.service';
import { FoodRestrictions, FoodAllergies, Customer, FoodRestrictionLink, FoodAllergyLink } from 'src/app/structures/customer';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-add-guest',
  templateUrl: './add-guest.component.html',
  styleUrls: ['./add-guest.component.css']
})


export class AddGuestComponent {

  addGuestForm: FormGroup;
  foodRestrictions: FoodRestrictions[];
  foodAllergies: FoodAllergies[];
  customer: Customer;
  submitted = false;
  titles: Array<title>;
  codes: Array<code>;
  showError = false;
  foodRestrictionLink: FoodRestrictionLink;
  foodAllergyLink: FoodAllergyLink;
  onClose = new EventEmitter();

  dateFilter = (d: Date): boolean => {
    // console.log('date:',d, d.getDay(), new Date().getDate())
    const day = d.getDate();
    // Prevent Saturday and Sunday from being selected.
    return day <= new Date().getDate()// !== 0 && day !== 6;
  }

  constructor(private globals: Globals,
    public dialogRef: MatDialogRef<AddGuestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private authenticationService: AuthenticationService
  ) {

  }

  ngOnInit() {
    this.createForm();
    this.titles = this.globals.titles;
    this.codes = this.globals.codes;
    this.getFoodAllergies();
    this.getFoodRestrictions();
    console.log('data:' , this.data);
   // this.addGuestForm.controls.name.setValue = this.data.name
  }

  //add a new guest
  addGuest(value) {

    this.submitted = true;
    // stop here if form is invalid
    if (this.addGuestForm.invalid) {
      this.showError = true;
      return;
    }

    const id = 0;
    var restaurant_id = this.authenticationService.getRestuarantID();
    const title = this.titles[value.title].value;
    const name = value.name;
    const lastname = value.lastname;
    const email = value.email;
    const phone = value.code + value.phone;
    const birth_date = value.birthdate;
    const company = value.company;
    const job_title = value.jobtitle;
    const status = value.status;
    const sex = value.sex;
    const notes = value.notes;
    const addDate = '';


    const customer: Customer = { id, restaurant_id, title, name, lastname, email, phone, birth_date, company, job_title, status, sex, notes, addDate };
    if (!customer) { return; }
    this.customerService.addCustomer(customer)
      .subscribe(customer => {
        this.customer = customer;
        this.data.id = this.customer.id;
        this.addFoodRestrictionLink(value.srestriction);
        this.addFoodAllergyLink(value.sallergy);
        this.onClose.emit(customer);
        this.dialogRef.close();
      },
        error => {
          console.log("error", error)
        })


    
  }

  //add restriction link to the customer
  addFoodRestrictionLink(value) {
    if (value) {
      const id = 0;
      const customer_id = this.customer.id;
      const restriction_id = value;
      const foodRestrictionLink: FoodRestrictionLink = { id, customer_id, restriction_id }
      if (!foodRestrictionLink) { return; }
      this.customerService.addRestrictionLink(foodRestrictionLink)
        .subscribe(foodRestrictionLink => {
          this.foodRestrictionLink = foodRestrictionLink;
        },
          error => {
            console.log("error", error)
          })
    }
  }
  //add link of allergy to the customer
  addFoodAllergyLink(value) {
    if (value) {
      const id = 0;
      const customer_id = this.customer.id;
      const allergy_id = value;
      const foodAllergyLink: FoodAllergyLink = { id, customer_id, allergy_id }
      if (!foodAllergyLink) { return; }
      this.customerService.addAllergyLink(foodAllergyLink)
        .subscribe(foodAllergyLink => {
          this.foodAllergyLink = foodAllergyLink;
        },
          error => {
            console.log("error", error)
          })
    }
  }
  //get Food Restrictions
  getFoodRestrictions() {
    this.customerService.getRestrictions()
      .subscribe(foodRestrictions => this.foodRestrictions = foodRestrictions);
  }
  //add food restriction
  addRestriction() {
    let control = this.addGuestForm.controls.restrictions;
    // console.log(control.value)
    const id = 0;
    const food_type = control.value;
    const foodRestrictions: FoodRestrictions = { id, food_type };
    if (!foodRestrictions) { return; }
    this.customerService.addRestriction(foodRestrictions)
      .subscribe(foodRestrictions => {
        this.foodRestrictions.push(foodRestrictions);
      },
        error => {
          console.log("error", error)
        })
  }


  //get Food Allergies
  getFoodAllergies() {
    this.customerService.getAllergies()
      .subscribe(foodAllergies => this.foodAllergies = foodAllergies);
  }

  //add food allergy
  addAllergy() {
    let control = this.addGuestForm.controls.allergy;
    //console.log(control.value)
    const id = 0;
    const food_type = control.value;
    const foodAllergy: FoodAllergies = { id, food_type };
    if (!foodAllergy) { return; }
    this.customerService.addAllergy(foodAllergy)
      .subscribe(foodAllergy => {
        this.foodAllergies.push(foodAllergy);
      },
        error => {
          console.log("error", error)
        })
  }

  onNoClick(): void {
    
    this.dialogRef.close();
  }

  get f() { return this.addGuestForm.controls; }

  createForm() {
    this.addGuestForm = this.fb.group({
      title: new FormControl(""),
      name: new FormControl(this.data.name, [Validators.required]),
      lastname: new FormControl(this.data.lastname, [Validators.required]),
      code: new FormControl("", [Validators.required]),
      phone: new FormControl(this.data.phone, [Validators.required]),
      email: new FormControl(),
      gender: new FormControl(""),
      birthdate: new FormControl(""),
      sex: new FormControl(""),
      company: new FormControl(""),
      jobtitle: new FormControl(""),
      status: new FormControl(""),
      srestriction: new FormControl(""),
      restrictions: new FormControl(""),
      sallergy: new FormControl(""),
      allergy: new FormControl(""),
      notes: new FormControl(""),
    });
  }

  get title() { return this.addGuestForm.get('title'); }
  get name() { return this.addGuestForm.get('name'); }
  get lastname() { return this.addGuestForm.get('lastname'); }
  get code() { return this.addGuestForm.get('code'); }
  get phone() { return this.addGuestForm.get('phone'); }
  get email() { return this.addGuestForm.get('email'); }
  get gender() { return this.addGuestForm.get('gender'); }
  get birthdate() { return this.addGuestForm.get('birthdate'); }
  get sex() { return this.addGuestForm.get('sex'); }
  get status() { return this.addGuestForm.get('status'); }
  get company() { return this.addGuestForm.get('company'); }
  get jobtitle() { return this.addGuestForm.get('jobtitle'); }
  get srestriction() { return this.addGuestForm.get('srestriction'); }
  get restriction() { return this.addGuestForm.get('restriction'); }
  get sallergy() { return this.addGuestForm.get('sallergy'); }
  get allergy() { return this.addGuestForm.get('allergy'); }
  get notes() { return this.addGuestForm.get('note'); }

}
