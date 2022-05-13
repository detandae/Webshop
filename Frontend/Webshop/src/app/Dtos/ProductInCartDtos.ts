import {ProductInCart} from '../models/productInCart.model'

export class ProductInCartDtos {
    
    username : string;
    size:string;
    ammount: number;
    productName: string;
    productid: number;

    constructor() {

     }
     CopyFromProductInCart(productincart: ProductInCart )
     {
         this.size=productincart.size;
         this.ammount=productincart.amount;
         this.productName=productincart.product.productName;
         this.productid=productincart.product.id;
     }
    
  }
  