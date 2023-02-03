const { Post } = require('../models/post');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs')
const util = require('util')

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') };
    }

    const PostList = await Post.find(filter).populate('category');

    if (!PostList) {
        res.status(500).json({ success: false });
    }
    res.send(PostList);
});

router.get(`/:id`, async (req, res) => {
    const post = await Post.findById(req.params.id).populate('category');

    if (!post) {
        res.status(500).json({ success: false });
    }
    res.send(post);
});

/* app.post('/images', upload.single('image'), async (req, res) => {
    const file = req.file
    console.log(file)

    // apply filter
    // resize 

    const result = await uploadFile(file)
    await unlinkFile(file.path)
    console.log(result)
    const description = req.body.description
    res.send({ imagePath: `/images/${result.Key}` })
}) */

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    let post = new Post({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        category: req.body.category,
        isFeatured: req.body.isFeatured
    });

    post = await post.save();

    if (!post) return res.status(500).send('The Post cannot be created');

    res.send(post);
});

router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Post Id');
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).send('Invalid Post!');

    const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            category: req.body.category,
            isFeatured: req.body.isFeatured
        },
        { new: true }
    );

    if (!updatedPost) return res.status(500).send('the Post cannot be updated!');

    res.send(updatedPost);
});

router.delete('/:id', (req, res) => {
    Post.findByIdAndRemove(req.params.id)
        .then((post) => {
            if (post) {
                return res.status(200).json({
                    success: true,
                    message: 'the Post is deleted!'
                });
            } else {
                return res.status(404).json({ success: false, message: 'Post not found!' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ success: false, error: err });
        });
});

router.get(`/get/count`, async (req, res) => {
    const postCount = await Post.countDocuments();

    if (!postCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        postCount: postCount
    });
});

router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const Posts = await Post.find({ isFeatured: true }).limit(+count);

    if (!Posts) {
        res.status(500).json({ success: false });
    }
    res.send(Posts);
});

router.post('/uploadfile', uploadOptions.single("imageEditor"), (req, res, next) => {
    const file = req.file
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    console.log(req);
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.status(200).send({
        status: true,
        originalName: `${file.filename}`,
        generatedName: `${file.filename}`,
        msg: "Image upload successful",
        imageUrl: `${basePath}${file.filename}`
    })

}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Post Id');
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {
        files.map((file) => {
            imagesPaths.push(`${basePath}${file.filename}`);
        });
    }

    const post = await Post.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPaths
        },
        { new: true }
    );

    if (!post) return res.status(500).send('the gallery cannot be updated!');

    res.send(post);
});

module.exports = router;
