const { Job } = require('../models/jobs');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) => {

    const JobList = await Job.find();

    if (!JobList) {
        res.status(500).json({ success: false });
    }
    res.send(JobList);
});

router.get(`/:id`, async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        res.status(500).json({ success: false });
    }
    res.send(job);
});

router.post(`/`, async (req, res) => {

    let job = new Job({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        companyName: req.body.companyName,
        jobTitle: req.body.jobTitle,
        jobType: req.body.jobType,
        jobCategory: req.body.jobCategory,
        salary: req.body.salary,
        experience: req.body.experience,
        qualification: req.body.qualification,
        level: req.body.level
    });

    job = await job.save();

    if (!job) return res.status(500).send('The Job cannot be created');

    res.send(job);
});

/*router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Post Id');
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).send('Invalid Post!');

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = post.image;
    }

    const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: imagepath,
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
});*/

module.exports = router;
