const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection

// const connectdb = async ()=> {
//   await mongoose.connect('mongodb://rahulthakur2314:myPass%40word%3A2024@<database>/?ssl=true&replicaSet=atlas-sf4olm-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }); 
//   console.log("mongodb connected using mongoose");

// } 

// const connectdb = async () => {
//   try {
//     await mongoose.connect('mongodb://rahulthakur2314:myPass%40word%3A2024@mydata.mongodb.net/yourDatabaseName?ssl=true&replicaSet=atlas-sf4olm-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }); 
//     console.log("mongodb connected using mongoose");
//   } catch (error) {
//     console.error("Error connecting to MongoDB", error);
//   }
// };


const mongoose = require('mongoose');

const connectdb = async () => {
  try {
    await mongoose.connect('mongodb+srv://rahulthakur2314:myPass%40word%3A2024@mydata.mongodb.net/yourDatabaseName?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("mongodb connected using mongoose");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

connectdb();






// Define User Schema for Authentication
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', UserSchema);

// Define Availability Schema
const availabilitySchema = new mongoose.Schema({
  user: String, // Reference user
  start: Date,
  end: Date,
  duration: Number,
  scheduledSlots: Array,
});

const Availability = mongoose.model('Availability', availabilitySchema);

// --- Authentication Routes ---

// Signup Route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// --- Availability Management Routes ---

// Create Availability
app.post('/availability', async (req, res) => {
  const { user, start, end, duration } = req.body;
  try {
    const availability = new Availability({ user, start, end, duration, scheduledSlots: [] });
    await availability.save();
    res.status(201).json(availability);
  } catch (error) {
    res.status(500).json({ message: 'Error creating availability', error });
  }
});

// Fetch All Availabilities
app.get('/availability', async (req, res) => {
  try {
    const availabilities = await Availability.find();
    res.status(200).json(availabilities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching availabilities', error });
  }
});

// Update Availability
app.put('/availability/:id', async (req, res) => {
  const { id } = req.params;
  const { start, end, duration } = req.body;
  try {
    const updatedAvailability = await Availability.findByIdAndUpdate(
      id,
      { start, end, duration },
      { new: true }
    );
    if (!updatedAvailability) {
      return res.status(404).json({ message: 'Availability not found' });
    }
    res.status(200).json(updatedAvailability);
  } catch (error) {
    res.status(500).json({ message: 'Error updating availability', error });
  }
});

// Delete Availability
app.delete('/availability/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAvailability = await Availability.findByIdAndDelete(id);
    if (!deletedAvailability) {
      return res.status(404).json({ message: 'Availability not found' });
    }
    res.status(200).json({ message: 'Availability deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting availability', error });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
  connectdb();

});



