const mongoose = require('mongoose');

const jobsSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    jobCategory: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    }
})

jobsSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

jobsSchema.set('toJSON', {
    virtuals: true,
});


exports.Job = mongoose.model('Jobs', jobsSchema);
