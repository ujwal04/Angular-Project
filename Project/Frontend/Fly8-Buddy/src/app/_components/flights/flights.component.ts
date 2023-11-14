import { Component, OnInit } from '@angular/core';
import { Flight } from 'src/app/_models/flight.model';
import { FlightDataService } from 'src/app/_services/flight-data.service';
import { DBConfig, NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit{
  flight: Flight = new Flight();
  flightAvailable:boolean = false;
  showFlightDetail: boolean = false;
  sources:any[];
  destinations:any[];
  currentDate: string;

  constructor(private flightService:FlightDataService,private dbService: NgxIndexedDBService){
    this.currentDate = new Date().toISOString().split('T')[0];
  }
  dbConfig: DBConfig = {
    name: 'myDb',
    version: 1,
    objectStoresMeta: [{
      store: 'routes',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'route', keypath: 'route', options: { unique: false } },
        { name: 'price', keypath: 'price', options: { unique: false } }
      ]
    }]
  };
  ngOnInit(): void {
    this.flightService.getFlightDetails().subscribe({
      next:(data:any)=>{
      }
    });

  }

  incrementAdults() {
    if (!this.flight.numberOfAdults) {
      this.flight.numberOfAdults = 1;
    } else {
      this.flight.numberOfAdults++;
    }
  }

  decrementAdults() {
    if (this.flight.numberOfAdults && this.flight.numberOfAdults > 0) {
      this.flight.numberOfAdults--;
    }
  }

  incrementChildren() {
    if (!this.flight.numberOfChildren) {
      this.flight.numberOfChildren = 1;
    } else {
      this.flight.numberOfChildren++;
    }
  }

  decrementChildren() {
    if (this.flight.numberOfChildren && this.flight.numberOfChildren > 0) {
      this.flight.numberOfChildren--;
    }
  }

  incrementInfants() {
    if (!this.flight.numberOfInfants) {
      this.flight.numberOfInfants = 1;
    } else {
      this.flight.numberOfInfants++;
    }
  }

  decrementInfants() {
    if (this.flight.numberOfInfants && this.flight.numberOfInfants > 0) {
      this.flight.numberOfInfants--;
    }
  }

  onSubmit(formData: Flight) {

    // Here you can handle the form data
    this.flightService.getFlightPrice(formData).subscribe({
      next:response=>{
        alert("Total cost of tickets: $"+ response.totalPrice);
        formData = null;
        this.flightAvailable = true;
        this.flight.price = response.totalPrice;
        this.showFlightDetail = true;
      },
      error:err=>{alert(err.error);
      this.flightAvailable = false;
      },
      complete:()=>console.log('complete')
    })
  }

  closeFlightDetails() {
    this.showFlightDetail = false; // Set the flag to false when closing Component B
  }

}
