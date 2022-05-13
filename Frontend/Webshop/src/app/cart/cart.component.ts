import { Component, OnInit } from '@angular/core';
import { DataManagerService } from 'app/services/data-manager';
import { CartService } from 'app/services/cart-service';
import { ProductInCart } from 'app/models/productInCart.model';
import { ProductModel } from 'app/models/product.model';
import {UserService} from  'app/services/user-service';
import { Router, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  dataManager:DataManagerService;
  cartService:CartService;
  productsInCart:ProductInCart[]=[];
  userService:UserService
  appURL:string
  constructor(dataManager:DataManagerService,cartService:CartService,userService:UserService,
    private route: ActivatedRoute,private router: Router, @Inject('APP_URL') appURL: string)
  {
    this.appURL=appURL;
    this.userService=userService
    this.dataManager=dataManager;
    this.cartService=cartService;
    this.productsInCart=this.cartService.getProductsInCart();
    console.log("products in cart number: "+this.productsInCart.length);
    let productsInCart:ProductInCart[]=this.productsInCart;
    if(productsInCart) 
    {
      console.log("I have something");
      console.log(productsInCart.length);
      for(let i=0; i<productsInCart.length;i++)
      {
        console.log("number:"+ i)
        console.log(productsInCart[0].product.productName);
        console.log(productsInCart[0].size);
        console.log(productsInCart[0].amount);
      }
    } 
    else
    {
      console.log("Nothing here...");
    }
  }
  buttonPlusClicked(productInCart)
  {
    productInCart.amount++;
    this.cartService.UpdateProductInCart(productInCart);
 console.log(productInCart);
  }

  buttonMinusClicked(productInCart)
  {
    productInCart.amount--;
    this.cartService.UpdateProductInCart(productInCart);
    console.log(productInCart);
  }
  buttonDeleteClicked(productInCart)
  {
    const index = this.productsInCart.indexOf(productInCart);
    if(index > -1) {
      this.productsInCart.splice(index, 1);
    }
    this.cartService.DeleteProductInCart(productInCart);
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

  OnCheckoutClicked()
  {
    this.cartService.productsInCart=this.productsInCart;
    let value=this.router.navigate(['../Checkout']);
  }

  public GetImageURL(product:ProductModel):string
  {
    if(product!=null)
    {
      console.log(product.imageURL);
    return this.appURL+product.imageURL;
    }
    return null;
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


  async ngOnInit() {
   if(this.userService.IsUserLoggedIn()==true)
   {
     try
     {
       const data=await this.cartService.GetProductsInCartFromServer();
       console.log("response: "+JSON.stringify(data));
       this.productsInCart=data;
       this.cartService.productsInCart=this.productsInCart;
     }
     catch(err)
     {
       console.log(err);
     }
   }
   else
   {


   }
  }

}
