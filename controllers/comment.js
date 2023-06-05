const db = require("../models");
const Comment = db.comment;
const Profile = db.profile;

exports.getAllComments = (req, res, next) => {
    const postId = req.params.id;
    Comment.findAll({
        where: { postId },
        include: {
            model: Profile,
            attributes: {
                exclude: ['about']
            }
        }
    })
        .then((comments) => res.status(200).json(
            comments
        ))
        .catch((err) => res.status(404).json({
            error: new Error('Could not complete request.')
        }))
};

exports.createComment = (req, res, next) => { 
    const comment = {
        profileId: req.body.profileId,
        postId: req.body.postId,
        text: req.body.text
    };
    Comment.create(comment)
        .then(() => {
            res.status(201).json({
                message: 'Successfully posted!'
            })
        })
        .catch(() => {
            res.status(400).json({
                error: new Error('Could not save comment.')
            })
        })
};

exports.removeComment = (req, res, next) => {
    const id = req.params.id;
    Comment.findByPk(id)
        .then((comment) => {
            if(!comment) {
                return res.status(404).json({
                    error: new Error('Comment not found')
                })
            };
            if(comment.profileId !== req.auth.profileId) {
                return res.status(400).json({
                    error: new Error('Unauthorized request!')
                })
            };
            
            Comment.destroy({ where: { id }})
                .then(() => { res.status(200).json({
                    message: 'Comment deleted!'
                    });
                })
                .catch(() => { res.status(400).json({
                    error: new Error('Unable to delete')
                    });
                });
            });
};