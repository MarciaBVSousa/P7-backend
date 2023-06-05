const db = require("../models");
const Post = db.post;
const Profile = db.profile;
const fileSystem = require('fs');

exports.getAllPosts = (req, res) => {
    Post.findAll({ 
        include: { 
            model: Profile,
            attributes: ['id', 'avatarUrl', 'name' ]
        }
    })
        .then((posts) => res.status(200).json(
            posts
        ))
        .catch((err) => res.status(404).json({
            error: new Error('Could not complete request.')
        }))
};

exports.getUserPosts = (req, res) => {
    const profileId = req.params.id;
    Post.findAll({ 
        where: { profileId },
        include: { 
            model: Profile,
            attributes: ['id', 'avatarUrl', 'name' ]
        }

    })
        .then((posts) => res.status(200).json(
            posts
        ))
        .catch((err) => res.status(404).json({
            error: new Error('Could not complete request.')
        }))
};

exports.createPost = (req, res) => { 
    let post;
    if(req.file) {
        const url = req.protocol + '://' + req.get('host');
        req.body.post = JSON.parse(req.body.post);

        // auth
        if( req.body.post.profileId !== req.auth.profileId ) {
            return res.status(400).json({
                error: new Error('Unauthorized request!')
            })
        }

        post =  {
            profileId: req.body.post.profileId,
            text: req.body.post.text,
            image: url + '/images/' + req.file.filename
        }

    } else {
        post = {
            profileId: req.body.profileId,
            text: req.body.text
        }
    };

    Post.create(post)
        .then(() => {
            res.status(201).json({
                message: 'Successfully posted!'
            })
        })
        .catch(() => {
            res.status(400).json({
                error: new Error('Could not post.')
            })
        })
};

exports.removePost = (req, res, next) => {
    const id = req.params.id;
    Post.findByPk(id)
        .then((post) => {
            if(!post) {
                return res.status(404).json({
                    error: new Error('Post not found')
                })
            };
            if(post.profileId !== req.auth.profileId) {
                return res.status(400).json({
                    error: new Error('Unauthorized request!')
                })
            };
            if(post.image) {
                const filename = post.image.split('/images/')[1];
                fileSystem.unlink('images/' + filename, (err) => {
                    if(err) {
                        throw 'Unable to update image';
                    };
                });
            };
            
            Post.destroy({ where: { id } })
                .then(() => { res.status(200).json({
                    message: 'Post deleted!'
                    });
                })
                .catch(() => { res.status(400).json({
                    error: new Error('Unable to delete')
                    });
                });
            });
};

exports.updateSeenBy = (req, res) => {
    const id = req.params.id;
    Post.findByPk(id)
        .then((post => {
            const userSaw = req.body.profileId;
            post.seenBy.push(userSaw)

            Post.update({ seenBy: post.seenBy }, {
                where: { id }
            })
                .then(() => {
                    res.status(201).json({
                        message: 'Profile successfully updated!'
                    });
                })
                .catch((err) => {
                    throw err
                });
        })) 
        .catch(() => { res.status(500).json({
            error: new Error('Unable to make modifications!')
          });
        });
};