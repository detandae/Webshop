import { Component, OnInit } from '@angular/core';
import { DataManagerService } from 'app/services/data-manager';
import {ProductModel} from '../models/product.model'
import { Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { QuestionDialogWindowComponent } from 'app/question-dialog-window/question-dialog-window.component';
import { CategoryModel } from 'app/models/category.model';

@Component({
  selector: 'app-product-editor-list',
  templateUrl: './product-editor-list.component.html',
  styleUrls: ['./product-editor-list.component.css']
})

export class ProductEditorListComponent implements OnInit {
  appURL:string;
  productsURL:string;
  products:ProductModel[]=[];
  categorys:CategoryModel[]=[];
  selectedProducts:ProductModel[]=[];
  private subscription: any;

  question:string="Are you sure to delete this product"

  sex:string;
  categoryName:string="";
  categoryNameValidated:boolean=false;
  sexValidated:boolean=false;

  categoryWarning:boolean=false;
  categoryReservedWarning:boolean=false;

  dialogResult=null;
  dialogRef;
  constructor(private dataManager:DataManagerService,private dialog: MatDialog) 
  { 

  }

  openDialogProduct(Inputquestion:string,Inputtitle:string): void {
      this.dialogRef = this.dialog.open(QuestionDialogWindowComponent, {
      width: '400',
      height: '175px',
      data: {question: Inputquestion,title:Inputtitle}
    });
  }

  openDialogCategory(Inputquestion:string,Inputtitle:string): void {
    this.dialogRef = this.dialog.open(QuestionDialogWindowComponent, {
    width: '400px',
    height: '200px',
    data: {question: Inputquestion,title:Inputtitle}
  });
}
openDialogCategoryAdd(Inputquestion:string,Inputtitle:string): void {
  this.dialogRef = this.dialog.open(QuestionDialogWindowComponent, {
  width: '400px',
  height: '200px',
  data: {question: Inputquestion,title:Inputtitle}
});
}

  async ngOnInit() {
    this.products=await this.dataManager.GetProductsForAdmin();
    this.categorys= await this.dataManager.GetCategorys();

    this.subscription=this.dataManager.ProductAdded.subscribe(
      async()=>
      {
        this.products=await this.dataManager.GetProductsForAdmin();
        console.log("Products refreshed");
     });
  }

  OnDeleteCategoryClicked(category)
  {
    console.log(category.category);
    console.log("Delete category");
    this.openDialogCategory("Are you sure to delete this category? All the product with this category will be also deleted!",
                    "Delete Category");

    this.dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.dialogResult = result.data;
      if(this.dialogResult=="confirm")
      {
        console.log("delete category");
        this.dataManager.DeleteCategory(category);
        var index = this.categorys.indexOf(category);
        if (index !== -1) {
          this.categorys.splice(index, 1);
          }
        var indexes=[];
        for(let i=0;i<this.products.length;i++)
        {
          if(this.products[i].category.category==category.category &&
              this.products[i].category.sex== category.sex
            )
            {
              indexes.push(i);
            }
        }
        for(let i=0;i<indexes.length;i++)
        {
          if (indexes[i] !== -1) {
            this.products.splice(index, 1);
            }
        }

      }
    });
  }

  AddNewCategory()
  {
    if(this.categoryNameValidated && this.sexValidated)
    {
      console.log("add category");
      this.categoryWarning=false;
      this.categoryReservedWarning=false;
      this.openDialogCategoryAdd("Are you sure, that you would like to add this category?","Add category");
      this.dialogRef.afterClosed().subscribe(async (result) => {
        console.log('The dialog was closed');
        this.dialogResult = result.data;
        if(this.dialogResult=="confirm")
        {
          let category=new CategoryModel();
          category.category=this.categoryName;
          category.sex=this.sex;
          let Errstatus=await this.dataManager.AddCategory(category);
          if(Errstatus.status!="OK")
          {
            this.categoryReservedWarning=true;
          }
          this.categorys.push(category);
        }
      });
   

    }
    else
    {
      this.categoryReservedWarning=false;
      this.categoryWarning=true
    }
  }

  categoryNameChanged()
  {
    console.log("a");
    if(this.categoryName.length>1)
    {
      this.categoryNameValidated=true;
    }
    else
    {
      this.categoryNameValidated=false;
    }
  }

  sexChanged()
  {
    if(this.sex!="")
    {
      this.sexValidated=true;
    }
    else
    {
      this.sexValidated=false;
    }
  }

  DeleteButtonClicked()
  {
    console.log("Delete products");
    this.openDialogProduct("Are you sure to delete these product?","Delete Products");
    this.dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.dialogResult = result.data;
      console.log("result: "+JSON.stringify(this.dialogResult));
      if(this.dialogResult=="confirm")
      {
        this.dataManager.DeleteProducts(this.selectedProducts);
        for(let i=0;i<this.selectedProducts.length;i++)
        {
          var index = this.products.indexOf(this.selectedProducts[i]);
          if (index !== -1) {
            this.products.splice(index, 1);
            }
        }
        this.selectedProducts=[];
      }
    });
  }

  CheckboxChanged(product:ProductModel)
  {
    if(!this.selectedProducts.includes(product))
    {
      console.log("product added to list: "+product.productName);
      this.selectedProducts.push(product);
    }
    else
    {
      console.log("product removed from list: "+product.productName);
      var index = this.selectedProducts.indexOf(product);
      if (index !== -1) {
        this.selectedProducts.splice(index, 1);
        }
    }
  }

  OnDeleteClicked(product:ProductModel)
  {
    console.log(product.productName);
    console.log("Delete products");
    this.openDialogProduct("Are you sure to delete this product?","Delete Product");

    this.dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.dialogResult = result.data;
      console.log("result: "+JSON.stringify(this.dialogResult));
      if(this.dialogResult=="confirm")
      {
        console.log("delete item");
        this.dataManager.DeleteProduct(product);
        var index = this.products.indexOf(product);
        if (index !== -1) {
          this.products.splice(index, 1);
          }
      }
    });
  }

}
