const mongoose = require('mongoose');

const jobsSchema = mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    jobTitle: {
        type: String,
        required: true
    },
    vacanciesNumber: {
        type: number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    town: {
        type: String,
        required: true
    },
    employmentType: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    isConfidential: {
        type: Boolean,
        default: false
    },
    isRemoteJob: {
        type: Boolean,
        default: false
    },
    hasJobRelocation: {
        type: Boolean,
        default: false
    },
    isPartiallyRemoteJob: {
        type: Boolean,
        default: false
    },
    jobDescription: {
        type: String,
        required: true
    },
    keywords: [{
        type: String,
        required: true
    }],
    carrerLevel: {
        type: String,
        required: true
    },
    spokenLanguages: [{
        type: String,
        required: true
    }],
    shouldKnowAllLanguages: {
        type: Boolean,
        default: false
    },
    interviewQuestions: [{
        type: String
    }],
    additionalAddress: [{
        type: String
    }],
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
