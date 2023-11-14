class FlightDetails {
    constructor() {
        this.routePrices = [
            { route: 'New York-London', price: 200 },
            { route: 'London-Paris', price: 180 },
            { route: 'London-Madrid', price: 220 },
            { route: 'New York-Paris', price: 250 },
            { route: 'Paris-Rome', price: 200 },
            { route: 'default', price: 150 }, // Default price
            // Add more routes as needed
          ];
    }

    getBasePrice(source, destination,date) {
        const route = `${source}-${destination}`;
        const foundRoute = this.routePrices.find(r => r.route === route);

        if(foundRoute){
            return foundRoute.price
        }
        else{
            return "No Flight available for the specified route"
        }

    }
}

module.exports = FlightDetails;