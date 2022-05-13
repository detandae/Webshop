import { Component, OnInit } from '@angular/core';
import {UserService} from  'app/services/user-service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  userService:UserService; 
  route:ActivatedRoute;
  router:Router;
  //checkout form
  firstName:string;
  lastName:string;
  email:string;
  address:string;
  city:string;
  zip:number;
  country:string;
  paymentMethod:string;
  username:string="";
  password:string="";

  //css
  firstNameClass:string;
  lastNameClass:string;
  emailClass:string;
  addressClass:string;
  cityClass:string;
  zipClass:string;
  countryClass:string;
  usernameClass:string;
  passwordClass:string;
  //
  firstNameWarning:boolean=false;
  lastNameWarning:boolean=false;
  emailWarning:boolean=false;
  addresseWarning:boolean=false;
  cityWarning:boolean=false;
  zipWarning:boolean=false;
  countryWarning:boolean=false;
  submitWarning:boolean=false;
  usernameWarning:boolean=false;
  passwordWarning:boolean=false;

  userNameTaken:boolean=false;

  //validation
  firstNameValidated:boolean=false;
  lastNameValidated:boolean=false;
  emailValidated:boolean=false;
  addressValidated:boolean=false;
  cityValidated:boolean=false;
  zipValidated:boolean=false;
  countryValidated:boolean=false;
  usernameValidated:boolean=false;
  passwordValidated:boolean=false;

  emailRegexp= new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  readonly invalid_input:string ="form-control is-invalid";
  readonly valid_input:string ="form-control";

  submitted:boolean = false;

  constructor(userService:UserService,  route: ActivatedRoute,
    router: Router) {

    this.userService=userService;
    this.route=route;
    this.router=router;
    this.firstNameClass=this.valid_input;
    this.lastNameClass=this.valid_input;
    this.emailClass=this.valid_input;
    this.addressClass=this.valid_input;
    this.cityClass=this.valid_input;
    this.zipClass=this.valid_input;
    this.countryClass=this.valid_input;
    this.usernameClass=this.valid_input;
    this.passwordClass=this.valid_input;

    this.paymentMethod="cash";

   }
   
  firstNameChanged()
  {
    console.log(this.firstName);
    if(this.firstName.length>1)
    {
      this.firstNameClass=this.valid_input;
      this.firstNameValidated=true;
      this.firstNameWarning=false;
    }
    else
    {
      this.firstNameClass=this.invalid_input;
      this.firstNameValidated=false;
      this.firstNameWarning=true;
    }
  }

  lastNameChanged()
  {
    console.log(this.lastNameChanged);
    if(this.lastName.length>1)
    {
      this.lastNameClass=this.valid_input;
      this.lastNameValidated=true;
      this.lastNameWarning=false;
    }
    else
    {
      this.lastNameClass=this.invalid_input;
      this.lastNameValidated=false;
      this.lastNameWarning=true;
    }
  }

  emailChanged()
  {
    this.emailValidated =this.emailRegexp.test(this.email);

    if(this.emailValidated)
    {
      this.emailClass=this.valid_input;
      this.emailWarning=false;
    }
    else
    {
      this.emailClass=this.invalid_input;
      this.emailWarning=true;
    }
  }

  adressChanged()
  {
    console.log(this.address);
    if(this.address.length>1)
    {
      this.addressClass=this.valid_input;
      this.addressValidated=true;
      this.addresseWarning=false;
    }
    else
    {
      this.addressClass=this.invalid_input;
      this.addressValidated=false;
      this.addresseWarning=true;
    }
  }
  cityChanged()
  {
    console.log(this.city);
    if(this.city.length>1)
    {
      this.cityClass=this.valid_input;
      this.cityValidated=true;
      this.cityWarning=false;
    }
    else
    {
      this.cityClass=this.invalid_input;
      this.cityValidated=false;
      this.cityWarning=true;
    }
  }
  zipChanged()
  {
    console.log(this.zip);
    if(this.isNormalInteger(this.zip))
    {
      this.zipClass=this.valid_input;
      this.zipValidated=true;
      this.zipWarning=false;
    }
    else
    {
      this.zipClass=this.invalid_input;
      this.zipValidated=false;
      this.zipWarning=true;
    }
  }

    isNormalInteger(str):boolean {
    str = str.trim();
    if (!str) {
        return false;
    }
    str = str.replace(/^0+/, "") || "0";
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}

  countryChanged()
  {
    console.log(this.country);
    if(this.country!="")
    {
      //reverse logic
      this.countryValidated=true;
      this.countryWarning=false
    }
    else
    {
      this.countryValidated=false;
      this.countryWarning=true
    }
  }

  usernameChanged()
  {
    console.log(this.username);
    if(this.userService.validateUserName(this.username))
    {
      this.usernameClass=this.valid_input;
      this.usernameValidated=true;
      this.usernameWarning=false;
    }
    else
    {
      this.usernameClass=this.invalid_input;
      this.usernameValidated=false;
      this.usernameWarning=true;
    }
  }

  passwordChanged()
  {
    console.log(this.password);
    if(this.userService.validatePassword(this.password))
    {
      this.passwordClass=this.valid_input;
      this.passwordValidated=true;
      this.passwordWarning=false;
    }
    else
    {
      this.passwordClass=this.invalid_input;
      this.passwordValidated=false;
      this.passwordWarning=true;
    }
  }

  checkIfFormValidated()
  {
    let validated:boolean=this.firstNameValidated && this.lastNameValidated &&
    this.emailValidated && this.addressValidated && this.cityValidated && this.countryValidated 
    this.usernameValidated && this.passwordValidated;
    return validated;
  }
  
  async onSubmit(form:any) {
     this.submitted=this.checkIfFormValidated();
     console.log(this.submitted);
     if(this.submitted==true)
     {
       console.log("GO");
      this.submitWarning=false;
      this.userService.user.userName=this.username;
      this.userService.user.password=this.password;
      this.userService.user.email=this.email;
      this.userService.user.firstName=this.firstName;
      this.userService.user.lastName=this.lastName;
      this.userService.user.adress.city=this.city;
      this.userService.user.adress.country=this.country;
      this.userService.user.adress.street=this.address;
      this.userService.user.adress.zip=this.zip;
      try{
      const resp = await this.userService.ResgisterUser();
      console.log("registered user: ");
      let value=this.router.navigate(['../shop']);
      }
      catch(err)
      {
        console.log(err);
        this.userNameTaken=true;
      }
    }
    
     else{
      console.log("No GO");
      this.submitWarning=true;
     }
  }

  ngOnInit() {
  }

}
