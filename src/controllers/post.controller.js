const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/authenticate');
const Post = require('../models/post.model');
const router = express.Router();

// Create a Post
router.post(
    '/',
    [
        auth,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('body', 'Body is required').not().isEmpty(),
            check('geoLocation.latitude', 'Latitude is required').isFloat(),
            check('geoLocation.longitude', 'Longitude is required').isFloat(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, body, geoLocation } = req.body;
        const createdBy = req.user._id;
        // console.log(createdBy)

        try {
            const newPost = new Post({
                title,
                body,
                createdBy,
                geoLocation,
            });

            const post = await newPost.save();
            // console.log(post)
            res.json(post);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Get all posts by authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find({ createdBy: req.user._id });
        // console.log(posts)
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a Post
router.put('/:id', auth, async (req, res) => {
    const { title, body, active, geoLocation } = req.body;
    let id = req.params.id
    // console.log("id", id)

    // Build post object
    const postFields = {};
    if (title) postFields.title = title;
    if (body) postFields.body = body;
    if (typeof active !== 'undefined') postFields.active = active;
    if (geoLocation) postFields.geoLocation = geoLocation;

    try {
        let post = await Post.findById(id.toString());

        if (!post) return res.status(404).json({ msg: 'Post not found' });

        // Check user
        if (post.createdBy !== req.user._id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        post = await Post.findByIdAndUpdate(
            req.params.id,
            { $set: postFields },
            { new: true }
        );

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a Post
router.delete('/:id', auth, async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId.toString());

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check user
        if (post.createdBy !== req.user._id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Post.findByIdAndDelete(postId);
        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get posts by latitude and longitude
router.get('/geo/:lat/:lon', auth, async (req, res) => {
    const { lat, lon } = req.params;

    try {
        const posts = await Post.find({
            'geoLocation.latitude': lat,
            'geoLocation.longitude': lon,
            createdBy: req.user._id 
        });

        if (!posts || posts.length === 0) {
            return res.status(404).json({ msg: 'No posts found for this location' });
        }

        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Get count of active and inactive posts
router.get('/count/status', auth, async (req, res) => {
    try {
        const activeCount = await Post.countDocuments({ createdBy: req.user._id, active: true });
        const inactiveCount = await Post.countDocuments({ createdBy: req.user._id, active: false });

        res.json({ active: activeCount, inactive: inactiveCount });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
