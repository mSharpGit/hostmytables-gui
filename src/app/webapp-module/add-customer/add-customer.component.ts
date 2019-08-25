
import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData, title, code, AddGuestDialogData } from 'src/app/structures/interfaces';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Globals } from 'src/app/structures/globals';
import { CustomerService } from 'src/app/services/customer.service';
import { FoodRestrictions, FoodAllergies, Customer, FoodRestrictionLink, FoodAllergyLink } from 'src/app/structures/customer';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AddGuestComponent } from '../components/add-guest/add-guest.component';
import { DataService } from 'src/app/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ConditionalExpr } from '@angular/compiler';
import { RestrictionsService } from 'src/app/services/restrictions.service';
import { AllergiesService } from 'src/app/services/allergies.service';
@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {

  addGuestForm: FormGroup;
  foodRestrictions: FoodRestrictions[];
  custRestrictions: FoodRestrictions[] = [];
  updatedRestrictions = false;
  foodAllergies: FoodAllergies[];
  custAllergies: FoodAllergies[] = [];
  updatedAllergies = false;
  submitted = false;
  titles: Array<title>;
  codes: Array<code>;
  showError = false;
  foodRestrictionLink: FoodRestrictionLink;
  foodAllergyLink: FoodAllergyLink;
  onClose = new EventEmitter();
  ADD = false;
  customer: Customer;
  type: string;
  selectedTitle: title[]
  selectedCode: code[]


 /*  dateFilter = (d: Date): boolean => {
    // console.log('date:',d, d.getDay(), new Date().getDate())
    const day = d.getDate();
    // Prevent Saturday and Sunday from being selected.
    return day <= new Date().getDate()// !== 0 && day !== 6;
  } */

  constructor(private globals: Globals,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private restrictionsService: RestrictionsService,
    private allergiesService: AllergiesService,
    private authenticationService: AuthenticationService,
    private data: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.type = params['type'];
      // In a real app: dispatch action to load the details here.
    });
    console.log('type', this.type)
    if (this.type === 'Add') {
      this.customer = new Customer;
      this.ADD = true;
      this.createForm();
      this.titles = this.globals.titles;
      this.codes = this.globals.codes;
      this.getFoodAllergies();
      this.getFoodRestrictions();
    } else {
      this.data.currentCustomer.subscribe(customer => this.customer = customer)
      if (!this.customer) {
        this.router.navigate(['webapp/customer']);
      } else {
        this.restrictionsService.getRestriction(this.customer.id).subscribe(restrictions => {
        this.custRestrictions = restrictions;
        })
        this.allergiesService.getAllergy(this.customer.id).subscribe(allergies => {
        this.custAllergies = allergies;
        })


        this.createForm();
        this.titles = this.globals.titles;
        this.codes = this.globals.codes;
        this.getFoodAllergies();
        this.getFoodRestrictions();
        this.selectedTitle = this.titles.filter(c => c.value === this.customer.title)
        console.log('selected_title:', this.selectedTitle)
        this.selectedCode = this.codes.filter(c => c.value === this.customer.country_code)
        this.addGuestForm.controls['title'].setValue(this.selectedTitle[0].id)
        this.addGuestForm.controls['code'].setValue(this.selectedCode[0].value)
        this.addGuestForm.controls['sex'].setValue(this.customer.sex)
        this.addGuestForm.controls['status'].setValue(this.customer.status)
      }
    }
  }

  filterTitle(id) {
    return this.titles.filter(c => c.id === id)[0].value
  }
  //edit guest
  editGuest(value) {
   // console.log('guest edit called', value)

    if (this.updatedAllergies) { 
      var foodAllergiesLink: FoodAllergyLink[] = [];
      var index = 0; 
      console.log('Allergies updated', foodAllergiesLink) 
      

      for (index = 0; index < this.custAllergies.length; index++) { 
        const id = 0;
      const customer_id = this.customer.id;
      const allergy_id = this.custAllergies[index].id;
      const foodAllergyLink: FoodAllergyLink = { id, customer_id, allergy_id}
      foodAllergiesLink.push(foodAllergyLink);
      } 
    
      //foodRestrictionsLink.push(foodRestrictionLink);
      this.allergiesService.deleteCustAllergies(this.customer.id).subscribe(r => {
        console.log('allergies links deleted')
        this.allergiesService.addAllergyLink(foodAllergiesLink).subscribe(r => {
          console.log('allergy links added')
        },error => {
            console.log("error", error)
          });
      },error => {
          console.log("error", error)
        });
      
     }
    
    if (this.updatedRestrictions) { 
      var foodRestrictionsLink: FoodRestrictionLink[] = [];
      var index = 0; 
      console.log('restrictions updated', foodRestrictionsLink) 
      

      for (index = 0; index < this.custRestrictions.length; index++) { 
        const id = 0;
      const customer_id = this.customer.id;
      const restriction_id = this.custRestrictions[index].id;
      const foodRestrictionLink: FoodRestrictionLink = { id, customer_id, restriction_id}
        foodRestrictionsLink.push(foodRestrictionLink);
      } 
    
      //foodRestrictionsLink.push(foodRestrictionLink);
      this.restrictionsService.deleteCustRestrictions(this.customer.id).subscribe(r => {
        console.log('restriction links deleted')
        this.restrictionsService.addRestrictionLink(foodRestrictionsLink).subscribe(r => {
          console.log('restriction links added')
        },error => {
            console.log("error", error)
          });
      },error => {
          console.log("error", error)
        });
      
  }
    this.submitted = true;
    // stop here if form is invalid
    if (this.addGuestForm.invalid) {
      this.showError = true;
      return;
    }


    const id = this.customer.id;
    var restaurant_id = this.authenticationService.getRestuarantID();
    const title = this.filterTitle(value.title);
    const name = value.name;
    const lastname = value.lastname;
    const email = value.email;
    const country_code = value.code;
    const phone = value.phone;
    const birth_date = value.birthdate;
    const company = value.company;
    const job_title = value.jobtitle;
    const status = value.status;
    const sex = value.sex;
    const notes = value.notes;
    const add_date = this.customer.add_date;


    const customer: Customer = { id, restaurant_id, title, name, lastname, email, country_code, phone, birth_date, company, job_title, status, sex, notes, add_date };
    if (JSON.stringify(this.customer) === JSON.stringify(customer)) {
      console.log('customers are equal')
      this.cancel();
    } else {
      console.log('customers are different')
      if (!customer) { return; }
      this.customerService.editCustomer(customer)
        .subscribe(customer => {
          this.customer = customer;
          //this.addFoodRestrictionLink(value.srestriction);
          // this.addFoodAllergyLink(value.sallergy);
          this.onClose.emit(customer);
          //this.dialogRef.close();
          this.cancel();
        },
          error => {
            console.log("error", error)
          })
    }


  }

  //add a new guest
  addGuest(value) {

    
    

    this.submitted = true;
    // stop here if form is invalid
    if (this.addGuestForm.invalid) {
      this.showError = true;
      return;
    }

    console.log('value',value)
    const id = 0;
    var restaurant_id = this.authenticationService.getRestuarantID();
    const title = this.filterTitle(value.title);
    const name = value.name;
    const lastname = value.lastname;
    const email = value.email;
    const country_code = value.code;
    const phone = value.phone;
    const birth_date = value.birthdate;
    const company = value.company;
    const job_title = value.jobtitle;
    const status = value.status;
    const sex = value.sex;
    const notes = value.notes;
    const add_date = '';


  
    const customer: Customer = { id, restaurant_id, title, name, lastname, email, country_code, phone, birth_date, company, job_title, status, sex, notes, add_date };
    console.log('customer:',customer)
    if (!customer) { return; }
    this.customerService.addCustomer(customer)
      .subscribe(customer => {
        this.customer = customer;

        //linking the customer to its restrictions and allrgies
        if (this.updatedAllergies) { 
          var foodAllergiesLink: FoodAllergyLink[] = [];
          var index = 0; 
          console.log('Allergies updated', foodAllergiesLink) 
          
    
          for (index = 0; index < this.custAllergies.length; index++) { 
            const id = 0;
          const customer_id = this.customer.id;
          const allergy_id = this.custAllergies[index].id;
          const foodAllergyLink: FoodAllergyLink = { id, customer_id, allergy_id}
          foodAllergiesLink.push(foodAllergyLink);
          } 
        
            this.allergiesService.addAllergyLink(foodAllergiesLink).subscribe(r => {
              console.log('allergy links added')
            },error => {
                console.log("error", error)
              });
          }
          
         if (this.updatedRestrictions) { 
          var foodRestrictionsLink: FoodRestrictionLink[] = [];
          var index = 0; 
          console.log('restrictions updated', foodRestrictionsLink) 
          
    
          for (index = 0; index < this.custRestrictions.length; index++) { 
            const id = 0;
          const customer_id = this.customer.id;
          const restriction_id = this.custRestrictions[index].id;
          const foodRestrictionLink: FoodRestrictionLink = { id, customer_id, restriction_id}
            foodRestrictionsLink.push(foodRestrictionLink);
          } 
        this.restrictionsService.addRestrictionLink(foodRestrictionsLink).subscribe(r => {
              console.log('restriction links added')
            },error => {
                console.log("error", error)
              });
          }
        //this.addFoodRestrictionLink(value.srestriction);
        //this.addFoodAllergyLink(value.sallergy);
        this.onClose.emit(customer);
        //this.dialogRef.close();
        this.cancel();
      },
        error => {
          console.log("error", error)
        })



  }

  //add restriction link to the customer
  /*  addFoodRestrictionLink(value) {
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
   } */
  //add link of allergy to the customer
  /*  addFoodAllergyLink(value) {
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
   } */
  //get Food Restrictions
  getFoodRestrictions() {
    this.restrictionsService.getRestrictions()
      .subscribe(foodRestrictions => this.foodRestrictions = foodRestrictions);
  }
  //delete food customer restriction
  deleteCustRestriction(restriction) {
    this.custRestrictions = this.custRestrictions.filter(restrict => restrict != restriction);
    this.updatedRestrictions = true;
  }
  //add food customer restriction
  addCustRestriction() {
   
    let control = this.addGuestForm.controls.restriction;
    //console.log(control.value)
    if (control.value != "") {
      const id = control.value;
      const food_type = this.foodRestrictions.filter(r => r.id === id)[0].food_type;
      const foodRestrictions: FoodRestrictions = { id, food_type };
      if (!foodRestrictions) { return; }
      this.custRestrictions.push(foodRestrictions)
      this.updatedRestrictions = true;
    }
  }
  //add food restriction
  /* addRestriction() {
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
  } */


  //get Food Allergies
  getFoodAllergies() {
    this.allergiesService.getAllergies()
      .subscribe(foodAllergies => this.foodAllergies = foodAllergies);
  }

  //delete food customer restriction
  deleteCustAllergy(allergy) {
    this.custAllergies = this.custAllergies.filter(aller => aller != allergy);
    this.updatedAllergies = true;
  }
  //add food customer restriction
  addCustAllergy() {
    
    let control = this.addGuestForm.controls.allergy;
    if (control.value != "") {
      const id = control.value;
      const food_type = this.foodAllergies.filter(r => r.id === id)[0].food_type;
      const foodAllergies: FoodAllergies = { id, food_type };
      if (!foodAllergies) { return; }
      this.custAllergies.push(foodAllergies)
      this.updatedAllergies = true;
    }
  }

  //add food allergy
  /* addAllergy() {
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
  } */

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  get f() { return this.addGuestForm.controls; }

  createForm() {
    this.addGuestForm = this.fb.group({
      title: new FormControl(""),
      name: new FormControl(this.customer.name, [Validators.required]),
      lastname: new FormControl(this.customer.lastname, [Validators.required]),
      code: new FormControl("", [Validators.required]),
      phone: new FormControl(this.customer.phone, [Validators.required]),
      email: new FormControl(this.customer.email),
      //gender: new FormControl(this.customer.sex),
      birthdate: new FormControl(this.customer.birth_date),
      sex: new FormControl(this.customer.sex),
      company: new FormControl(this.customer.company),
      jobtitle: new FormControl(this.customer.job_title),
      status: new FormControl(this.customer.status),
      restriction: new FormControl(""),
      restrictions: new FormControl(""),
      sallergy: new FormControl(""),
      allergy: new FormControl(""),
      notes: new FormControl(this.customer.notes),
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
  //get srestriction() { return this.addGuestForm.get('srestriction'); }
  get restriction() { return this.addGuestForm.get('restriction'); }
  //get sallergy() { return this.addGuestForm.get('sallergy'); }
  get allergy() { return this.addGuestForm.get('allergy'); }
  get notes() { return this.addGuestForm.get('note'); }

}
