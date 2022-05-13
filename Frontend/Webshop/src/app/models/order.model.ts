
import {ProductModel} from '../models/product.model'
import {AdressModel} from '../models/adress.model'
import {ProductInCart} from '../models/productInCart.model'

export class OrderModel {
    
    userId : string;
    adress:AdressModel;
    productincarts: ProductInCart[];
    paymentMethod: number;
    orderTime: string;

    constructor( )
     {

     }

    public ReturnPaymentMethod():string
    {
        if(this.paymentMethod==0)
        {
            return "Cash";
        }
        if(this.paymentMethod==1)
        {
            return "PayPal"
        }
    }
}