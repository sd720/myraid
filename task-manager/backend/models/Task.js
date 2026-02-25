const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
