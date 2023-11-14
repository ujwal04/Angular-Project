const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const Flight = require('./Models/flightModel');
const FlightDetails = require('./Models/flightDetail');
const FlightManager = require('./Models/FlightManager')
const Booking = require('./Models/Booking');
const { log } = require('console');

const secretkey = '1234';
const app = express();
const port = 3000;


app.use(cors());

app.use(bodyParser.json());

// Endpoint to provide flight source and destination data
app.get('/flights', (req, res) => {
  let flightDetails = new FlightDetails();
  res.json(flightDetails.routePrices);
});

// POST endpoint to handle user input
app.post('/flights', (req, res) => {
  const {
    source,
    destination,
    dateOfTravel,
    numberOfAdults,
    numberOfChildren,
    travelClass
  } = req.body;

  let flightManager = new FlightManager();
  const totalPrice = flightManager.calculatePrice(source, destination, numberOfAdults, numberOfChildren, dateOfTravel, travelClass);
  if (typeof totalPrice == 'number') {
    res.status(200).json({ totalPrice: totalPrice });
  }
  else {
    res.status(404).json(totalPrice);
  }
});

app.post('/createBooking', (req, res) => {

  // Load existing data from the file, if any
  let existingData = [];
  try {
    const data = fs.readFileSync('data.json');
    existingData = JSON.parse(data);
  } catch (err) {
    // File doesn't exist or couldn't be read; an empty array will be used
  }

  // Push the new data into the existing array
  existingData.push(req.body);

  // Write the updated data back to the file
  fs.writeFileSync('data.json', JSON.stringify(existingData, null, 2));

  res.send({ message: 'Booking created successfully!' });

})

class User {
  firstName;
  lastName;
  email;
  password;
  address1;
    address2;
    city;
    state;
    zip;

  constructor(
    firstName,
    lastName,
    email,
    password,
    address1,
    address2,
    city,
    state,
    zip
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.address1 = address1;
    this.address2 = address2;
    this.city = city;
    this.state = state;
    this.zip = zip;
  }
}

const users = [];

app.post('/createUser', (req, res) => {
  const { _firstName, _lastName, _email, _password, _address1, _address2, _city, _state, _zip } = req.body;
  //create a new user with the provided data
  const newuser = new User(_firstName, _lastName, _email, _password, _address1, _address2, _city, _state, _zip);
  users.push(newuser);
  res.status(200).json({ message: 'User Regitered successfully' });
})

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  //find the user with the provided credentials
  const user = users.find((user) => user.email === email && user.password === password);

  if (user) {
    const payload = {
      email: user.email
    };

    const token = jwt.sign(payload, secretkey);
    res.status(200).json({ message: 'Login successful', token: token });
  }
  else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

//Middleware for authentication
app.use((req, res, next) => {
  const token = req.header('Authorization');  
  if(!token) return res.status(410).json({message:'Access denied. No token provided'});
  try{
    const decoded = jwt.verify(token, secretkey);
    req.user = decoded;
    next();
  }
  catch(ex){
    res.status(400).send({message:'Invalid Token'});
  }  
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


