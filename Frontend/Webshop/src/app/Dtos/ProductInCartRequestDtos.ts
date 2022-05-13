import {ProductInCart} from '../models/productInCart.model'

export class ProductInCartRequestDtos {
    
    username : string;
    size:string;
    amount: number;
    productName: string;
    productid: number;

    constructor() {

     }
     CopyFromProductInCart(productincart: ProductInCart )
     {
         this.size=productincart.size;
         this.amount=productincart.amount;
         this.productName=productincart.product.productName;
         this.productid=productincart.product.id;
     }
    
  }
  