
import {CategoryModel} from '../models/category.model'

export class ProductModel {
   

    id : number;
    productName:string;
    imageURL:string;
    s:number;
    m:number;
    l:number;
    xl:number;
    xxl:number;
    sold: number
    basePrice: number;
    action:number;
    producer: string;
    color: string;
    material: string;
    description:string;
    category:CategoryModel;
    highlighted: boolean;
    creationtime:string;
    constructor()
    {
       this.category=new CategoryModel();
    }
   
     PrintProduct()
     {
        console.log("Product: ")
        console.log( this.id.toString());
        console.log( this.productName);
        console.log( this.basePrice.toString());
        
        console.log( this.description.toString());
     }
  }
  