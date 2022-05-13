import { Component, OnInit } from '@angular/core';
import { DataManagerService } from 'app/services/data-manager';
import { CartService } from 'app/services/cart-service';
import { ProductInCart } from 'app/models/productInCart.model';
import { ProductModel } from 'app/models/product.model';
import {UserService} from  'app/services/user-service';
import {OrderService} from  'app/services/oder-service';
import { FormsModule } from '@angular/forms';
import { BoundElementPropertyAst, isNgTemplate } from '@angular/compiler';
import { first } from 'rxjs/operator/first';
import { OrderDtos } from 'app/Dtos/OrderDtos';
import { AdressModel } from 'app/models/adress.model';
import { UserModel } from 'app/models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { SignalIRService } from 'app/services/signalIR-service';
import { PaymentDtos } from 'app/Dtos/PaymentDtos';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  dataManager:DataManagerService;
  cartService:CartService;
  productsInCart:ProductInCart[]=[];
  userService:UserService;

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
  registerUser:boolean = true;
  ShowPersonalData:boolean=false;
  UsernameTakenWarning:boolean=false;

  constructor(dataManager:DataManagerService,cartService:CartService,userService:UserService,private orderService:OrderService,private signalIRService:SignalIRService,
              private route: ActivatedRoute,private router: Router) {

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
    this.dataManager=dataManager;
    this.cartService=cartService;
    this.userService=userService;
    this.productsInCart=this.cartService.getProductsInCart();
    this.ShowPersonalData=!this.userService.IsUserLoggedIn();

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

  getTotalPrice()
  {
    let totalPrice=0;
  for(let i=0;i<this.productsInCart.length;i++)
  {
    totalPrice+=(this.productsInCart[i].product.basePrice-this.productsInCart[i].product.basePrice*this.productsInCart[i].product.action)*this.productsInCart[i].amount;
  }  
  return totalPrice;
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
  validateUserName():boolean
  {
    if(this.username.length>4)
    {
      return true;
    }
    return false;
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
    console.log(this.username);
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
    let validated:boolean= this.addressValidated && this.cityValidated && this.countryValidated 
                           && this.zipValidated;
    if(this.userService.IsUserLoggedIn()==true)
    {
      console.log("false: "+validated);
      return validated;
    }
    else{
      let validated_withUser=validated && this.usernameValidated && this.passwordValidated && this.firstNameValidated && this.lastNameValidated &&
                               this.emailValidated;
      console.log("true: "+validated_withUser);
      return validated_withUser;
    }

   
  }
  getRoundedPrice(productModel)
  {
  if(productModel!= undefined && productModel.action>0)
  {
    return(productModel.basePrice-productModel.action*productModel.basePrice).toFixed(2);
    
  }
  if(productModel!= undefined && productModel.action<=0)
  {
    return(productModel.basePrice).toFixed(2); 
  }
  return "";
 }
  
  registerUserChanged()
  {
    this.registerUser=!this.registerUser;
    console.log("registerUserChanged");
  }
  
 async onSubmit(form:any) {
     this.submitted=this.checkIfFormValidated();
     console.log(this.submitted);
     this.submitWarning=!this.submitted;
     console.log(1);
     if(this.submitted==true)
     {
     console.log("order create");
      this.submitWarning=false;
      let order=this.CreateOrder();
      try
      {
        //CASH
        if(this.paymentMethod=="cash")
        {
          const resp=await this.orderService.CreateOrder(order);
          if(resp.status=="RegisterError")
          {
            this.UsernameTakenWarning=true;
            return
          }
          else
          {
            this.UsernameTakenWarning=false;
          }
          let value=this.router.navigate(['../Success']);
        }
        else
        {
            //PAYPAL
            order.paymentMethod=1;
          let totalPrice=this.getTotalPrice();
          var resp= await this.orderService.RegisterUser(order);
          if(resp.status=="RegisterError")
          {
            this.UsernameTakenWarning=true;
            return
          }
          this.orderService.curentOder=order;

          //create signal IR connection 
          await this.signalIRService.startConnection();
          await this.signalIRService.getConnectionId();
          await this.signalIRService.addNotificationListener();   
          let paymentDtos=new PaymentDtos();
          paymentDtos.totalPrice=totalPrice;
          paymentDtos.connectionId=this.signalIRService.connectionId;
          await this.orderService.CreatePayment(paymentDtos);
          let value=this.router.navigate(['../PendingTransaction']);
        }
      
      }
      catch(err)
      {
        console.log(err); 
      }
    
      //place order here
     }
     else{
      this.submitWarning=true;
     }
  }

  CreateOrder():OrderDtos
  {
    let order=new OrderDtos();
    let adress={
      city:this.city,
      street:this.address,
      zip:this.zip,
      country:this.country
    }
    order.adress.CopyFromObject(adress);
    order.user=new UserModel();
    order.user.adress=new AdressModel();
    let adressModel=new AdressModel();
    adressModel.CopyFromObject(adress);
    if(this.userService.IsUserLoggedIn())
    {
      order.CopyDataFromUser(this.userService.user);
    }
    else
   {
     order.user.userName=this.username;
     order.user.password=this.password;
     order.user.email=this.email;
     order.user.firstName=this.firstName;
     order.user.lastName=this.lastName;
     order.user.role="User";
   }
   if(this.paymentMethod=="PayPal")
   {
     order.paymentMethod=1;
   }
   else
   {
    order.paymentMethod=0;
   }
   order.productincarts=this.cartService.productsInCart;
  // this.orderService.CreateOrder(order);
   order.orderTime=this.getCurrentDate();
   return order;
  }

  getCurrentDate():string
  {
    let date = new Date();
    var dateStr =
      ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
      ("00" + date.getDate()).slice(-2) + "/" +
      date.getFullYear() + " " +
      ("00" + date.getHours()).slice(-2) + ":" +
      ("00" + date.getMinutes()).slice(-2) + ":" +
      ("00" + date.getSeconds()).slice(-2);
      return dateStr;
  }

  ngOnInit() {
    console.log(this.userService.IsUserLoggedIn());
    if(this.userService.IsUserLoggedIn())
    {
      this.city=this.userService.user.adress.city;
      this.zip=this.userService.user.adress.zip;
      this.country=this.userService.user.adress.country;
      this.address=this.userService.user.adress.street;
    }
  }

}
