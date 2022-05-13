import { Component, OnInit, Input  } from '@angular/core';
import {ProductModel} from '../models/product.model'
import { Inject } from '@angular/core';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {
  @Input() productModel: ProductModel;
  imageURL:string;
  appURL:string;

  constructor(  @Inject('APP_URL') appURL: string) 
  { 
    this.appURL=appURL
  }
  
  PrintName()
  {
    console.log("myProductModel name: "+this.productModel.productName);
  }

  checkIfAction():boolean
  {
    if(this.productModel.action>0)
    {
      return true;
    }
    return false;
  }
  CheckAction(product:ProductModel)
  {
    if(product.action>0)
      {
        return true;
      }
    return false;
  }
  GetAction(product:ProductModel)
  {
    return "- "+(product.action*100).toFixed(0)+"%"; 
  }

  getRoundedPrice()
  {
    if(this.productModel.action>0)
    {
      return(this.productModel.basePrice-this.productModel.action*this.productModel.basePrice).toFixed(2)+"$";
    }
    return(this.productModel.basePrice).toFixed(2)+"$"; 
    
  }
  addToCartClicked()
  {
    console.log(this.productModel.productName+" clicked");
    //check if product already in cart, popup message , add product to cart!!
    
    //let productInCart=new ProductInCart(this.productModel,this.currentAmmount,this.currentSize);
    //this.cartService.addProductToCart(productInCart);
   // console.log("product added to cart");
    
  }
  CheckIfProductInCart()
  {

  }
  ngOnInit() {
    this.imageURL=this.appURL+this.productModel.imageURL;
    console.log("ProductModelId: "+this.productModel.id);
  }

}
