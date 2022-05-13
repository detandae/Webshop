import { Component, OnInit, } from '@angular/core';
import {ProductModel} from '../models/product.model';
import { DataManagerService } from 'app/services/data-manager';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private dataManager:DataManagerService) {

  }

  ngOnInit() {
  
  }

}
