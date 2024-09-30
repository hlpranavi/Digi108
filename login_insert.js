const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/iit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

// Define the User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
}, { collection: 'login' });

const User = mongoose.model('User', userSchema);

// Function to insert dummy data
const insertDummyData = async () => {
  try {
    // Dummy data array
    const dummyUsers = [
      { username: 'john_doe', password: 'password123' },
      { username: 'jane_smith', password: 'myPassword' },
      { username: 'keethu', password: 'keethuPass' },
      { username: 'admin_user', password: 'admin@123' }
    ];

    // Insert data into 'login' collection
    await User.insertMany(dummyUsers);

    console.log('Dummy data inserted successfully!');
  } catch (err) {
    console.error('Error inserting dummy data:', err);
  } finally {
    mongoose.connection.close();  // Close connection after operation
  }
};

// Call the function to insert the data
insertDummyData();
