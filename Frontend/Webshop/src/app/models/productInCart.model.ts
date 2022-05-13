import {ProductModel} from '../models/product.model'

export class ProductInCart {
    id: number;
    product:ProductModel;
    amount: number;
    size: string;
    constructor(product:ProductModel,amount:number, size:string) {
        this.product=product;
        this.amount=amount;
        this.size=size;
     }
  }
  