const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter service name'],
        trim: true,
        maxLength: [100, 'Service name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter service price'],
        maxLength: [5, 'Service price cannot exceed 5 characters'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please enter service description']
    },
    ratings: {
        type: Number,
        default: 0
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
    category: {
        type: String,
        required: [true, 'Please select category for this service'],
        enum: {
            values: [
                'Digital Marketing',
                'Social Media Management',
                'Graphics & Video Production',
                'Web Development',
                'Customer Service & QA',
                'Project Management',
                'Photography',
                'KOL',
                'Studio Services',
                'PC/Mobile Game Management'
               
            ],
            message: 'Please select correct category for service'
        }
    },
    // user: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Service', serviceSchema);