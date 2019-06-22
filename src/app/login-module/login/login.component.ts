import { Component, OnInit } from '@angular/core';
import { User } from '../../structures/user';
import { UsersService } from '../../services/users.service';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { NotificationsComponent } from 'src/app/notifications/notifications.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  currentUser: User;
  user: User[] = [];
  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  loading = false;
  error = '';

  constructor(private usersService: UsersService,
  private fb: FormBuilder,
  private route: ActivatedRoute,
  private router: Router,
  private authenticationService: AuthenticationService,
  private notify: NotificationsComponent) { 

  this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  //console.log("current user", this.authenticationService.currentUserValue)
   
  }
   
   

  ngOnInit() {
    this.createForm();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/webapp';
    //console.log("return url:", this.returnUrl)
    console.log("is logged in: ", this.authenticationService.isLoggedIn())
    console.log("is logged out: ", this.authenticationService.isLoggedOut())
    console.log("Expiration : ", this.authenticationService.getExpiration())
     // redirect to home if already logged in
     if (this.authenticationService.currentUserValue && this.authenticationService.isLoggedIn()) { 
      //console.log("iam current user")
      this.router.navigate(['/webapp']);
  }
 }

 // convenience getter for easy access to form fields
 get f() { return this.loginForm.controls; }

 createForm() {
  this.loginForm = this.fb.group({
     email: new FormControl("",  Validators.required ),
     password: new FormControl("",  Validators.required ),
     checked: new FormControl("false"),
   });
 }

// get email() { return this.loginForm.get('email'); }
// get password() { return this.loginForm.get('password'); }
//get checked() { return this.loginForm.get('checked'); }

 authUser(value) {
  //console.log(value.checked)
  //this.notify.showNotification('top','right','authorizing');
  this.submitted = true;
  // stop here if form is invalid
  if (this.loginForm.invalid) {
    return;
  }

  this.loading = true;
  console.log("logged from login", this.f.checked.value)
        this.authenticationService.login(this.f.email.value, this.f.password.value, +this.f.checked.value)
            .pipe(first())
            .subscribe(
                data => {
                  console.log("url:",this.returnUrl)
                  this.router.navigate([this.returnUrl]);
                 /*  if(this.returnUrl === "/"){this.router.navigate(['portal/3']);}
                   else{this.router.navigate([this.returnUrl]);}  */
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
  /* 
  const id = 0;
  const name = "";
  const surname= "";
  const password= value.password;
  const age= "";
  const address= "";
  const city= "";
  const email= value.email;
  const country= "";
  const postalcode= "";
  const confirmed= 0;
  const verifycode= "";
  const regdate= "";
  var Role;
  const Token= "";
  var Keeploged
  console.log(value.checked) 
  if (value.checked)
  {Keeploged= 1;} else 
  {Keeploged= 0;}

     console.log(value.checked)   
   const user: User = {id,name,surname,password,age,address, city,email,country,postalcode,confirmed,verifycode,regdate,Keeploged,Role, Token};
  if (!user) { return; }
  console.log(user);
  this.usersService.authUser(user)
    .subscribe(user => {
      console.log("resp",user);
      this.user.push(user);
      var expiredDate = new Date();
      expiredDate.setTime( expiredDate.getTime() + (30 * 1000) );
      this.cookieService.set( 'username', user.name, expiredDate );
      this.cookieService.set( 'id', String(user.id), expiredDate );
    },error => { 
     console.log("error",error)
    }) */
      }
}
