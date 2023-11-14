import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Booking } from 'src/app/_models/booking';
import { Flight } from 'src/app/_models/flight.model';
import { FlightDataService } from 'src/app/_services/flight-data.service';

@Component({
  selector: 'app-flight-detail',
  templateUrl: './flight-detail.component.html',
  styleUrls: ['./flight-detail.component.css']
})
export class FlightDetailComponent {
  @Input() flightDetails: Flight | undefined; // Receive flight details from parent component
  @Output() closeFlightDetails: EventEmitter<void> = new EventEmitter<void>();

  showPassengerDetailsForm = false; // Initially hide the form
  passengers: any[] = []; // Array to store passenger details
  flightBooked: boolean = false;

  adults: any[] = [];
  children: any[] = [];
  infants: any[] = []; // Array to store infant details

  constructor(private flightService: FlightDataService) {}

  closeFlightDetailsComponent() {
    this.flightDetails = undefined;
    this.showPassengerDetailsForm = false;
    this.passengers = [];
    this.closeFlightDetails.emit();
  }

  // Function to get age range based on 'adult', 'child', or 'infant'
  getAgeRange(type: 'adult' | 'child' | 'infant'): number[] {
    const startAge = type === 'adult' ? 12 : type === 'child' ? 3 : 0;
    const endAge = type === 'adult' ? 100 : type === 'child' ? 11 : 2;
    return Array.from({ length: endAge - startAge + 1 }, (_, index) => startAge + index);
  }

  openPassengerDetailsForm() {
    // Clear previous entries
    this.adults = [];
    this.children = [];
    this.infants = [];

    // Create input boxes for each adult
    for (let i = 0; i < this.flightDetails.numberOfAdults; i++) {
      this.adults.push({ name: '', age: 0 });
    }

    // Create input boxes for each child
    for (let i = 0; i < this.flightDetails.numberOfChildren; i++) {
      this.children.push({ name: '', age: 0 });
    }

    // Create input boxes for each infant
    for (let i = 0; i < this.flightDetails.numberOfInfants; i++) {
      this.infants.push({ name: '', age: 0 });
    }

    this.showPassengerDetailsForm = true; // Display the passenger details form
  }

  incrementInfants() {
    if (!this.flightDetails.numberOfInfants) {
      this.flightDetails.numberOfInfants = 1;
    } else {
      this.flightDetails.numberOfInfants++;
    }
  }

  decrementInfants() {
    if (this.flightDetails.numberOfInfants && this.flightDetails.numberOfInfants > 0) {
      this.flightDetails.numberOfInfants--;
    }
  }

  submitPassengerDetails() {
    // Handle submitted passenger details
    const userEmail = localStorage.getItem('userEmail');
    const booking: Booking = new Booking(
      userEmail,
      this.flightDetails.price,
      {
        source: this.flightDetails.source,
        destination: this.flightDetails.destination,
        date: this.flightDetails.dateOfTravel
      },
      [...this.passengers, ...this.infants]
    );

    this.flightService.createBooking(booking).subscribe({
      next: (response: any) => {
        this.flightBooked = true;
        alert(response.message);
      },
      error: (err) => console.log(err)
    });
    // You can send this data to your backend or perform required actions
  }

  generateTicketContent(): any {
    // Create the ticket content with the values from the booking variable
    const ticketContent = `
      **Flight Booking Ticket**

      Passenger Information:
      ${this.adults.map((adult, index) => `
        Adult ${index + 1}:
        - Name: ${adult.name}
        - Age: ${adult.age}`).join('')}

      ${this.children.map((child, index) => `
        Child ${index + 1}:
        - Name: ${child.name}
        - Age: ${child.age}`).join('')}

      ${this.infants.map((infant, index) => `
        Infant ${index + 1}:
        - Name: ${infant.name}
        - Age: ${infant.age}`).join('')}

      Flight Details:
      - Source: ${this.flightDetails.source}
      - Destination: ${this.flightDetails.destination}
      - Date of Travel: ${this.flightDetails.dateOfTravel}
      Total Price: ${this.flightDetails.price}`;

    return ticketContent;
  }

  downloadTicket() {
    const ticketContent = this.generateTicketContent();

    // Create a new Blob with the ticket content and set the MIME type
    const blob = new Blob([ticketContent], { type: 'text/plain' });

    // Create a download link
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);

    // Set the link's attributes
    a.href = url;
    a.download = 'flight_ticket.txt';

    // Simulate a click to trigger the download
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
  }
}
