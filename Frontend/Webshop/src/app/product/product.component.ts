import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductModel } from 'app/models/product.model';
import {ProductInCart} from '../models/productInCart.model'
import { DataManagerService } from 'app/services/data-manager';
import { CartService } from 'app/services/cart-service';
import { Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { QuestionDialogWindowComponent } from 'app/question-dialog-window/question-dialog-window.component';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  id: string;
  dataManagerService: DataManagerService;
  cartService: CartService;
  productModel:ProductModel;
  relatedProducts:ProductModel[]=[];
  showRelatedProducts:boolean=true;
  currentSize:string;
  currentAmmount:number=1;
  ShowS:boolean=true;
  ShowM:boolean=true;
  ShowL:boolean=true;
  ShowXL:boolean=true;
  ShowXXL:boolean=true;;

  S;
  M;
  L;
  XL;
  XXL;
  appURL:string;
  sizeWarning:boolean=false;
  ammountWarning:boolean=false;
  dialogResult=null;
  dialogRef;

  constructor(dataManager:DataManagerService,cartService:CartService,
            @Inject('APP_URL') appURL: string,private dialog: MatDialog,
               private route: ActivatedRoute,private router: Router) 
  {
    this.appURL=appURL;
    route.params.subscribe(params => { this.id = params['id'];
    this.update();
   }

    );
    console.log("ID: "+this.id);
    this.dataManagerService=dataManager;
    this.cartService=cartService;
  
    this.currentAmmount=1;
    this.currentSize="";
  }

  MinusClicked()
  {
    if(this.currentAmmount>0)
    {
    this.currentAmmount--;
    }
  }

  PlusClicked()
  {
    this.currentAmmount++;
  }

  getRoundedPriceForProduct(product:ProductModel)
  {
    if(product.action>0)
    {
      return(product.basePrice-product.action*product.basePrice).toFixed(2);
    }
    return(product.basePrice).toFixed(2); 
  }
    
  getRoundedPrice()
  {
  if(this.productModel!= undefined && this.productModel.action>0)
  {
    return(this.productModel.basePrice-this.productModel.action*this.productModel.basePrice).toFixed(2);
    
  }
  if(this.productModel!= undefined && this.productModel.action<=0)
  {
    return(this.productModel.basePrice).toFixed(2); 
  }
  return "";
 }

 getAction()
 {
 if(this.productModel!= undefined && this.productModel.action>0)
 {
   let action=(this.productModel.action*100).toFixed(2);
   return `(-${action}%)`
   
 }
 return "";
}

  sizeClicked(size:any)
  {
    this.currentSize=size;
    this.UncheckAllExeptOne(size);
  }

  UncheckAllExeptOne(size)
  {
    if(size=="S")
    {
      this.M=false;
      this.L=false;
      this.XL=false;
      this.XXL=false;
    }
    if(size=="M")
    {
      this.S=false;
      this.L=false;
      this.XL=false;
      this.XXL=false;
    }
    if(size=="L")
    {
      this.S=false;
      this.M=false;
      this.XL=false;
      this.XXL=false;
    }
    if(size=="XL")
    {
      this.S=false;
      this.M=false;
      this.L=false;
      this.XXL=false;
    }
    if(size=="XXL")
    {
      this.S=false;
      this.M=false;
      this.L=false;
      this.XL=false;
    }
  }

  buttonPlusClicked()
  {
  console.log("button+ clicked");
  this.currentAmmount++;
  }
  buttonMinusClicked()
  {
  console.log("button+ clicked");
  this.currentAmmount--;
  }

  openDialogProduct(Inputquestion:string,Inputtitle:string): void {
    this.dialogRef = this.dialog.open(QuestionDialogWindowComponent, {
    width: '400',
    height: '175px',
    data: {question: Inputquestion,title:Inputtitle}
  });
  }

  buttonAddToCartClicked()
  {
    console.log("Add to cart clicked");
    if(this.S || this.M || this.L || this.XL || this.XXL)
    {
      this.sizeWarning=false;
      if(this.currentAmmount>0)
      {
        this.ammountWarning=false;
        this.sizeWarning=false;
        this.openDialogProduct("Are you sure to add this product to cart?","Add Product to cart");
        this.dialogRef.afterClosed().subscribe(result => {
          this.dialogResult = result.data;
          if(this.dialogResult=="confirm")
          {
            let productInCart=new ProductInCart(this.productModel,this.currentAmmount,this.currentSize);
            this.cartService.addProductToCart(productInCart);
            let value=this.router.navigate(['../ShoppingCart']);
          }
        });
      }
      else
      {
        this.ammountWarning=true;
      }
    }
    else{
      this.sizeWarning=true;
      this.ammountWarning=false;
    }
  }
  NavigateToProduct(id)
  {
    console.log(id);
    let value=this.router.navigate(['../product', id]);
    console.log(value);
  }

  public GetImageURL():string
  {
    if(this.productModel!=null)
    {
    return this.appURL+this.productModel.imageURL;
    }
    return null;
  }
  public CheckSizes(productModel:ProductModel)
  {
    if(productModel.s<=0)
    {
      this.ShowS=false;
    }
    if(productModel.m<=0)
    {
      this.ShowM=false;
    }
    if(productModel.l<=0)
    {
      this.ShowL=false;
    }
    if(productModel.xl<=0)
    {
      this.ShowXL=false;
    }
    if(productModel.xxl<=0)
    {
      this.ShowXXL=false;
    }
  }

 async ngOnInit() {
   try
   {
    const data=await this.dataManagerService.getProduct(this.id.toString());
    console.log(JSON.stringify(data));
    this.productModel= data;
    let category=this.productModel.category;
    this.CheckSizes(this.productModel);
    let relatedProducts=await this.dataManagerService.GetRelatedProducts(category);
    if(relatedProducts.length<1)
    {
      this.showRelatedProducts=false;
    }
    this.relatedProducts=relatedProducts;
    console.log(JSON.stringify(this.relatedProducts));
    console.log("productName: "+this.productModel.productName);
   }
   catch(err)
   {
     console.log(err);
   }
   

  }
  update() {
    this.ngOnInit();
  }  
}
