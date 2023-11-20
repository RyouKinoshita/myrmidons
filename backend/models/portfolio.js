const mongoose = require('mongoose')

const portfolioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter event name'],
        trim: true,
        maxLength: [100, 'Event name cannot exceed 100 characters']
    },
    location: {
        type: String,
        require: [true, 'Please enter the location of event'],
        trim: true,
    },
    date: {
        type: Date,
        required: true,
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
    // category: {
    //     type: String,
    //     required: [true, 'Please select category for this service'],
    //     enum: {
    //         values: [
    //             'Digital Marketing',
    //             'Social Media Management',
    //             'Graphics & Video Production',
    //             'Web Development',
    //             'Customer Service & QA',
    //             'Project Management',
    //             'Photography',
    //             'KOL',
    //             'Studio Services',
    //             'PC/Mobile Game Management'
               
    //         ],
    //         message: 'Please select correct category for service'
    //     }
    // },
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

module.exports = mongoose.model('Portfolio', portfolioSchema);