import {UserService} from  'app/services/user-service';
import { Router, ActivatedRoute} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {SignalIRService} from  'app/services/signalIR-service';
import { Inject } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private signalRService: SignalIRService) { }

  ngOnInit() {
  }
}
