import { Component, OnInit } from '@angular/core';
import { DataManagerService } from 'app/services/data-manager';
import {ProductModel} from '../models/product.model'
import { CategoryModel } from 'app/models/category.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.css']
})
export class ProductEditorComponent implements OnInit {

  maleProductTypes:string[]=[]
  femaleProductTypes:string[]=[]
  productTypes:string[]=[];
  productName:string="";
  category:string;
  sex:string;
  description:string="";
  color:string="";
  numberinStock:number;
  price:number;
  action:number;
  material:string="";
  producer:string="";
  S:boolean=false;
  M:boolean=false;
  L:boolean=false;
  XL:boolean=false;
  XXL:boolean=false;
  Highlighted:boolean=false;
  image
  imageURL;

  ShowFormWarning:boolean=false;
  imageSelected:boolean=false;

  productNameValidated:boolean=false;
  categoryValidated:boolean=false;
  sexValidated:boolean=false;
  descriptionValidated:boolean=false;
  colorValidated:boolean=false;
  numberinStockValidated:boolean=false;
  priceValidated:boolean=false;
  actionValidated:boolean=false;
  materialValidated:boolean=false;
  producerValidated:boolean=false;

  actionWarning:boolean=false;
  constructor(private dataManager:DataManagerService, private route: ActivatedRoute,private router: Router) { 


  }

  async ngOnInit() {
    await this.dataManager.GetCategorys();
    let categorys=this.dataManager.categorys
    for(let i=0;i<categorys.length;i++)
    {
      if(categorys[i].sex=="male")
      {
        this.maleProductTypes.push(categorys[i].category);
        console.log(categorys[i].category)
      }
      if(categorys[i].sex=="female")
      {
        this.femaleProductTypes.push(categorys[i].category);
      }
    }
  }

  UploadImage()
  {
    console.log("upload image");
    document.getElementById('fileInput').click();
  }
  onSelectFile(event)
  {
    if (event.target.files && event.target.files[0]) {
      this.image=event.target.files[0];
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
      this.imageURL = reader.result;
      this.imageSelected=true;
      }
      
    }
  }

  productNameChanged()
  {
    console.log("a");
    if(this.productName.length>0)
    {
      this.productNameValidated=true;
    }
    else
    {
      this.productNameValidated=false;
    }
  }

  categoryChanged()
  {
    console.log(this.category)
    if(this.category!="")
    {
      this.categoryValidated=true;
    }
    else
    {
      this.categoryValidated=false;
    }
  }

  sexChanged()
  {console.log("a")
    if(this.sex!="")
    {
      this.sexValidated=true;
      if(this.sex=="male")
      {
        this.productTypes=this.maleProductTypes;
      }
      if(this.sex=="female")
      {
        this.productTypes=this.femaleProductTypes;
      }
    }
    else
    {
      this.sexValidated=false;
    }
  }

  descriptionChanged()
  {console.log("a")
    if(this.description.length>1)
    {
      this.descriptionValidated=true;
    }
    else
    {
      this.descriptionValidated=false;
    }
  }

  colorChanged()
  {console.log("a")
    if(this.color.length>1)
    {
      this.colorValidated=true;
    }
    else
    {
      this.colorValidated=false;
    }
  }

  numberinStockChanged()
  {console.log("a")
    if(this.numberinStock>0)
    {
      this.numberinStockValidated=true;
    }
    else
    {
      this.numberinStockValidated=false;
    }
  }

   priceChanged()
   {console.log("a")
    if(this.price>0)
    {
      this.priceValidated=true;
    }
    else
    {
      this.priceValidated=false;
    }
  }

  actionChanged()
   {console.log("a")
    if(this.action>=0 && this.action<100)
    {
      this.actionValidated=true;
      this.actionWarning=false;
    }
    else
    {
      this.actionValidated=false;
      this.actionWarning=true;
    }
  }

  materialChanged()
  {console.log("a")
   if(this.material.length>0)
   {
     this.materialValidated=true;
   }
   else
   {
     this.materialValidated=false;
   }
 }

 producerChanged()
  {console.log("a")
   if(this.productName.length>0)
   {
     this.producerValidated=true;
   }
   else
   {
     this.producerValidated=false;
   }
 }
  CheckSizeSelected()
  {
    return this.S|| this.M||this.L||this.XL||this.XXL;
  }
  AddProduct()
  {
    if(this.productNameValidated&&this.categoryValidated&&this.sexValidated&&this.descriptionValidated&&this.colorValidated&&this.numberinStockValidated
      &&this.priceValidated&&this.actionValidated&&this.materialValidated&&this.producerValidated && this.CheckSizeSelected() && this.imageSelected)
    {
      this.ShowFormWarning=false;

      console.log("OK");
      let product=new ProductModel();
      product.productName=this.productName;
      product.category.category=this.category;
      product.category.sex=this.sex;
      product.description=this.description;
      product.color=this.color;
      product.basePrice=this.price;
      product.action=this.action/100;
      product.material=this.material;
      product.producer=this.producer;
      product.creationtime=this.getCurrentDate();
      if(this.Highlighted==true)
      {
        product.highlighted=true;
      }
      else
      {
        product.highlighted=false;
      }
      if(this.S)
      {
        console.log("s")
        product.s=this.numberinStock;
        console.log(product.s);
      }
      else
      {
        console.log("else s")
        product.s=0;
      }
      if(this.M)
      {
        product.m=this.numberinStock;
      }
      else
      {
        product.m=0;
      }
      if(this.L)
      {
        product.l=this.numberinStock;
      }
      else
      {
        product.l=0;
      }
      if(this.XL)
      {
        product.xl=this.numberinStock;
      }
      else
      {
        product.xl=0;
      }
      if(this.XXL)
      {
        product.xxl=this.numberinStock;
      }
      else
      {
        product.xxl=0;
      }
      product.imageURL="comingSoon";
      console.log(JSON.stringify(product));
      this.dataManager.UploadProduct(product,this.image);
      let value=this.router.navigate(['../ProductEditorList']);
    }
    else
    {
      this.ShowFormWarning=true;
    }
  }

  private  getCurrentDate():string
  {
    let date = new Date();
    var dateStr =
      ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
      ("00" + date.getDate()).slice(-2) + "/" +
      date.getFullYear() + " " +
      ("00" + date.getHours()).slice(-2) + ":" +
      ("00" + date.getMinutes()).slice(-2) + ":" +
      ("00" + date.getSeconds()).slice(-2);
      return dateStr;
  }

  
  

}
