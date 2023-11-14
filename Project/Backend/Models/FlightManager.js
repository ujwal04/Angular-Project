const Flight = require('./flightModel');
const FlightDetail = require('./flightDetail');

class FlightManager {
    calculatePrice(source, destination, numberOfAdults, numberOfChildren, dateOfTravel, travelClass) {
        const flightDetail = new FlightDetail();
        let basePrice = flightDetail.getBasePrice(source, destination, dateOfTravel);

        if (typeof basePrice === 'number') {
            // Set multipliers for each travel class
            let classMultiplier = 1.0; // Default to Economy
            if (travelClass === 'Business') {
                classMultiplier = 1.5; // Adjust for Business class
            } else if (travelClass === 'FirstClass') {
                classMultiplier = 2.0; // Adjust for First Class
            }

            // Calculate the total price based on the base price and travel class multiplier
            let totalPrice = numberOfAdults * basePrice * classMultiplier + numberOfChildren * 0.75 * basePrice * classMultiplier;
            return totalPrice;
        }
    }
}

module.exports = FlightManager;
