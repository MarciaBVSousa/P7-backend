const db = require("../models");
const Profile = db.profile;
const Post = db.post;
const fileSystem = require('fs');

exports.getProfile = (req, res, next) => {
    const id = req.params.id;
    Profile.findByPk(id)
        .then((profile) => res.status(200).json(
            profile
        ))
        .catch(() => res.status(404).json({
            error: new Error('Profile not found.')
        }))
}

exports.modifyProfile = (req, res, next) => {
    let profile;
    const id = req.params.id;
    //auth
    if( Number(id) !== req.auth.profileId ) {
        return res.status(400).json({
            error: new Error('Unauthorized request!')
        })
    }
    if(req.file) {

        const url = req.protocol + '://' + req.get('host');
        req.body.profile = JSON.parse(req.body.profile);

        profile = {
            name: req.body.profile.name,
            department: req.body.profile.department,
            avatarUrl: url + '/images/' + req.file.filename,
            about: req.body.profile.about,
        };
        
        Profile.findByPk(id)
        .then((previousProfile) => {
            if(!previousProfile.avatarUrl) {
                return
            }
            const filename = previousProfile.avatarUrl?.split('/images/')[1];
            fileSystem.unlink('images/' + filename, (err) => {
                if(err) {
                    throw 'Unable to update image';
                };
            });
        })
        .catch(() => {
            res.status(404).json({
                error: new Error('Could not update properly.')
            })
        });   

    } else {
        profile = {
            name: req.body.name,
            department: req.body.department,
            about: req.body.about
        };
    };

    Profile.update(profile, {
        where: { id }
    })
        .then(() => {
            res.status(201).json({
                message: 'Profile successfully updated!'
            });
        })
        .catch(() => { res.status(500).json({
            error: new Error('Unable to make modifications!')
          });
        });
        
    };
    

exports.removeProfile = (req, res, next) => {
    const id = req.params.id;
    const userImages = [];

    Profile.findByPk(id)
        .then((profile) => {
            if(!profile) {
                return res.status(404).json({
                    error: new Error('Profile not found')
                })
            };
            if(profile.id !== req.auth.profileId) {
                return res.status(400).json({
                    error: new Error('Unauthorized request!')
                })
            };
            if(profile.avatarUrl) {
                const avatarFile = profile.avatarUrl.split('/images/')[1];
                userImages.push(avatarFile);
            };

            Post.findAll({ where: { profileId: id } })
                .then((posts) => {
                    posts.forEach((post) => {
                        if(post.image) {
                            const filename = post.image.split('/images/')[1];
                            userImages.push(filename);
                        }
                    })
                })
            
            Profile.destroy({ where: { id: id } })
                .then(() => {
                    if(userImages.length) {
                        userImages.forEach((file) => {  
                            fileSystem.unlink('images/' + file, (err) => {
                                if(err) {
                                    throw 'Unable to delete image';
                                };
                            });
                        });
                    }
                })
                .then(() => { res.status(200).json({
                    message: 'Profile deleted!'
                    });
                })
                .catch(() => { res.status(400).json({
                    error: new Error('Unable to delete!')
                    });
                });
            }); 
};