
import {AdressModel} from '../models/adress.model'

export class UserModel {
   

    ID : number;
    userName:string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    adress:AdressModel;
    role: string;
    

    constructor() {
        this.adress=new AdressModel();
     }

     CopyFromObject(user: any) {
        this.adress=new AdressModel();
        if(user.ID)
        {
        this.ID=user.ID;
        this.userName = user.userName;
        this.password=user.password;
        this.firstName=user.firstName;
        this.lastName=user.lastName;
        this.email = user.email;
        this.adress = user.adress;
        this.role =user.role;
        }
     }
     
 }
    
     
  
  