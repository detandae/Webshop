import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {UserService} from  'app/services/user-service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from 'app/services/cart-service';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  userService:UserService; 
  route:ActivatedRoute;
  router:Router;

  username:string;
  password:string;

  usernameClass:string;
  passwordClass:string;

  usernameWarning:boolean=false;
  passwordWarning:boolean=false;

  usernameValidated:boolean=false;
  passwordValidated:boolean=false;

  readonly invalid_input:string ="form-control is-invalid";
  readonly valid_input:string ="form-control";

  submitted:boolean=false;
  submitWarning:boolean=false;
  
  data:any;
  IncorrectData:boolean=false;
  
  constructor(userService:UserService,  route: ActivatedRoute,
    router: Router, private cartService:CartService)
  {
    this.userService=userService;
    this.route=route;
    this.router=router; 
    this.usernameClass=this.valid_input;
    this.passwordClass=this.valid_input;

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
    let validated:boolean=this.usernameValidated && this.passwordValidated;
    return validated;
  }

  ngOnInit() {
  }

  async onSubmit()
  {
    this.submitted=this.checkIfFormValidated();
    console.log(this.submitted);
    if(this.submitted==true)
    {
        const resp = await this.userService.AuthenticateUser(this.username,this.password);

        if(this.userService.errorStatus.status==null)
        {
          this.userService.user.userName=this.username;
          this.userService.SaveAuthorizationData(resp.token,resp.expire);
          console.log("valid?: "+this.userService.IsUserLoggedIn());
          console.log("Token: "+this.userService.authenticationToken);
          console.log("authentication was successfull!");
          for(let i=0;i<this.cartService.productsInCart.length;i++)
          {
            const resp=await this.cartService.addProductToCart(this.cartService.productsInCart[i]);
          }
          try
          {
            const data=await this.cartService.GetProductsInCartFromServer();
            console.log("response: "+JSON.stringify(data));
            this.cartService.productsInCart=data;
          }
          catch(err)
          {
            console.log(err);
          }
          let value=this.router.navigate(['../shop']);
        }
        else
        {
          console.log("authenticatio has failed!");
          this.IncorrectData=true;
        }
    }
   else
   {
     console.log("No GO");
    }

   }
    
}


