import models from '../models';
import path from 'path';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import  slugify from 'slugify';
import Util from '../utils/utils';

require('../utils/cloudinary');

// dotenv.config();

// const cloudinary = require('cloudinary').v2;
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET
// })

export default class ArticlesController {
    static async createArticle(req, res) {
        const fileExtension = path.extname(req.file.originalname);
        const { username }  = req.user;
        const image = req.file;
        const { title, description, body } = req.body;
        const articleSlug = slugify(title, {
          replacement: '-', // replace spaces with replacement
          remove: null, // regex to remove characters
          lower: true, // result in lower case
        });
        const articleData = {
          title,
          description,
          slug: articleSlug,
          body,
          author: username,
          image
        }

        console.log('POSTED DATA.....', articleData);
        const responseImageFiltering = Util.filterUploadedImage(fileExtension, res);
        if(responseImageFiltering) {
          console.log('COME ON.....');
          cloudinary.uploader.upload(req.file.path, (error, result) => {
            if (error){
              console.log('ERROR.......', error);
              // return res.send(err);
            }else {
               console.log('file uploaded to Cloudinary', result)
              //  res.json(image);
            }
          });
            try {
             
                // if (result) {
              // res.send(result);
                // }
                // const article = await models.Article.create({

                // });
                // if (article) {
                //     Util.setSuccess(200, 'Successfully created an article', article);
                //     Util.sendResponse(res);
                // }
            } catch (error) {
                Util.setError(500, error.message);
                Util.sendResponse(res);
            }
        }
        
        console.log('EXTENSION.......', responseImageFiltering);

    }

    static async updateAnArticle(req, res) {
        const {
            username
        } = req.params;
        const {
            firstname,
            lastname,
            bio
        } = req.body;
        const usernameFromToken = req.user.username;
        const profile = await models.User.findOne({
            where: {
                username: username,
            }
        });
        try {

            if (!profile) {
                Util.setError(404, 'User Not Found');
                return util.sendResponse(res);
            } else {
                if (username === usernameFromToken) {
                    return profile.update({
                        firstname: firstname || profile.firstname,
                        lastname: lastname || profile.lastname,
                        bio: bio || profile.bio
                    }).then(() => {
                        Util.setSuccess(200, 'Profile has been successfully updated', profile);
                        return Util.sendResponse(res);
                    })
                } else {
                    Util.setSuccess(200, 'You can not update a profile that does not belong to you', 'success');
                    return Util.sendResponse(res);
                }
            }
        } catch (err) {
            Util.setError(400, err.message);
            return Util.sendResponse(res);
        }
    }

    static async getAnArticle(req, res) {
        const {
            username
        } = req.params;
        try {
            const userProfile = await models.User.findOne({
                where: {
                    username
                }
            });
            if (!userProfile) {
                Util.setSuccess(200, 'User Not Found', 'success');
                return Util.sendResponse(res);
            } else {
                const specificUserProfile = {
                    firstname: userProfile.firstname,
                    lastname: userProfile.lastname,
                    bio: userProfile.bio,
                    username: userProfile.username,
                    email: userProfile.email,
                    avarta: userProfile.avarta
                }
                Util.setSuccess(200, `${userProfile.username} user profile`, specificUserProfile);
                return Util.sendResponse(res);
            }
        } catch (error) {
            Util.setError(400, error.message);
            return Util.sendResponse(res);
        }
    }

}
