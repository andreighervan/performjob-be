const mongoose = require('mongoose');

const postsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
})

postsSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

postsSchema.set('toJSON', {
    virtuals: true,
});


exports.Post = mongoose.model('Post', postsSchema);
