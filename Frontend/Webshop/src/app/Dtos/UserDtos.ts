import {UserModel} from '../models/user.model'
import {AdressModel} from '../models/adress.model'

export class UserDtos {
    
    username : string;
    password:string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    adress:AdressModel
    constructor() {
    }

    CopyDataFromUser(user:UserModel)
    {
    this.username=user.userName;
    this.password=user.password;
    this.firstName=user.firstName;
    this.lastName=user.lastName;
    this.role="User";
    this.email=user.email;
    }
}