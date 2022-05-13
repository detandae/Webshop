import {UserModel} from '../models/user.model'
import {AdressModel} from '../models/adress.model'
import {ProductInCart} from '../models/productInCart.model'
export class OrderDtos {
    
    user :UserModel ;
    //Adress
    adress:AdressModel;

    //ProductInCart
    productincarts:ProductInCart[];
    paymentMethod:number;
    orderTime:string;

    constructor() {
        this.adress=new AdressModel();
        this.user=new UserModel();
    }

    CopyDataFromUser(user:UserModel)
    {
    this.user.userName=user.userName;
    this.user.password=user.password;
    this.user.firstName=user.firstName;
    this.user.lastName=user.lastName;
    this.user.role=user.role;
    this.user.email=user.email;
    }
}