const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Enter Member Name:'],
    trim: true,
    maxLength: [100, 'Member Name cannot exceed 100 characters']
  },
  position: {
    type: String, 
    required: [true, 'Please Enter Your Position/Role:'],
    maxLength: [100, 'Position Name cannot exceed 100 characters'],
    default: 'N/A' 
  },
  description: {
    type: String,
    required: [true, 'Please Enter Brief Description:']
  },
  images: [
    {
      public_id: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
    }
  ],
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Member', memberSchema);