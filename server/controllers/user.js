import { validationResult } from 'express-validator';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import jwt_decode from 'jwt-decode';
import models from '../models';

export default class UserController {
	static async create(req, res) {
		const avarta = gravatar.url(req.body.email, {
			s: '200',
			r: 'pg',
			d: 'mm'
		});
		const user = await models.User.findOne({
			where: {
				email: req.body.email
			}
		});

		try {
			if (user) {
				return res.status(409).send({
					email: 'Email already exists',
				});
			}
			handlePasswordHash(req, res, avarta);
		} catch (error) {
			return res.status(400).send({
				error: error
			});
		}
	}

	static async passwordResetRequest(req, res) {
		const token = req.params.token;
		const decoded = jwt_decode(token);
		const { email, exp } = decoded;
		const { password } = req.body;
		if (Date.now() >= exp * 1000) {
			return res.status(403).json({
				status: false,
				message: 'Token has exprired please send password reset request again'
			});
		}
		//  Find the user by Email
		const user = await models.User.findOne({
			where: {
				email
			}
		});

		try {
			if (!user) {
				return res.status(404).json({
					email: 'User not found'
				});
			} else {
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(password, salt, (err, hash) => {
						if (err) throw err;
						const password = hash;
						user.update({
							password: password
						});
						res.status(200).json({
							success: true,
							message: 'Password Successfully Changed'
						});
					});
				});
			}
		} catch (error) {
			res.status(404).json({
				err: error.message
			})
		}
	}

	static async passwordReset(req, res) {
		const userEmail = req.body.email;
		const payload = {
			email: userEmail
		};
		// Generate the token or Sign Token
		jwt.sign(
			payload,
			process.env.SECRETKEY,
			{
				expiresIn: 3600
			},
			(err, token) => {
				const link = `http://localhost:3000/api/users/auth/password-reset-request/${token}`;

				const transporter = nodemailer.createTransport({
					service: 'gmail',
					auth: {
						user: 'franciskiryowa68@gmail.com',
						pass: 'kiryowa@1993'
					}
				});

				const mailOptions = {
					from: 'franciskiryowa68@gmail.com',
					to: userEmail,
					subject: 'Password Reset',
					html: `
                        <h1 style = "color:#4E9CAF;">Reset Password </h1>
                        <a href ='${link}'
                        style="
                            width: 130 px;
                            height: 25 px;
                            background: #4E9CAF;
                            padding: 10px;
                            text-align: center;
                            border-radius: 5px;
                            color: white;
                            font-weight: bold;
                            text-decoration:none;
                        ">Reset password</a>
                        <br>
                        <br>
                        `
				};
				transporter.sendMail(mailOptions, function(error, info) {
					if (error) {
						res.status(404).json({
							err: error.message,
						});
					} else {
						res.json({
							success: true,
							userToken: token,
							message: 'Email Has Been Successfully Sent, Check your email'
						});
					}
				});
			}
		);
	}

	static async verifyUser(req, res) {
		const token = req.params.token;
		const decoded = jwt_decode(token);
		if (Date.now() >= decoded.exp * 1000) {
			return res.status(403).json({
				status: false,
				message: 'Token has exprired please register again'
			});
		}
		const user = await models.User.findByPk(decoded.id, {
			attributes: [ 'id' ]
		});
		try {
			if (!user) {
				return res.status(404).send({
					message: 'User Not Found'
				});
			}
			user.update({
				isVerified: true
			});
			res.status(200).json({
				success: true,
				message: 'Account Successfully Verified'
			});
		} catch (error) {
			res.status(404).json({
				err: error.message
			})
		}
	}

	static async loginUser(req, res) {
		//  Call catch Validation errors function
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array()
				});
			}
		} catch (error) {
			return next(err);
		}
		// Get email and password
		const email = req.body.email;
		const password = req.body.password;
		//  Find the user by Email
		const user = await models.User.findOne({
			where: {
				email
			}
		});

		try {
			if (!user) {
				return res.status(404).json({
					email: 'User not found'
				});
			} else if (!user.isVerified) {
				return res.status(200).json({
					message: 'Please confirm your email to login'
				});
			}
			// Check Password
			const isMatch = await bcrypt.compare(password, user.password);
			if (isMatch) {
				checkPasswordMatch(user, res, isMatch);
			}
		} catch (error) {
			res.status(404).json({
				err: error.message,
			});
		}
	}

	static async handleUserCreation(req, res, avarta) {
		//  Call catch Validation errors function
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array()
				});
			}
		} catch (error) {
			return next(error);
		}
		const { username, email, password } = req.body;

		return models.User
			.create({
				username: username,
				email: email,
				avarta,
				isVerified: false,
				password: password
			})
			.then((user) => {
				// Create JWT payload
				const payload = {
					id: user.id,
					username: user.username,
					avarta: avarta,
					email: user.email
				};
				// Generate the token or Sign Token
				jwt.sign(
					payload,
					process.env.SECRETKEY,
					{
						expiresIn: 3600
					},
					(err, token) => {
						const link = `http://localhost:8080/api/users/auth/verify-user-account/${token}`;

						const transporter = nodemailer.createTransport({
							service: 'gmail',
							auth: {
								user: 'franciskiryowa68@gmail.com',
								pass: 'kiryowa@1993'
							}
						});

						const mailOptions = {
							from: 'franciskiryowa68@gmail.com',
							to: email,
							subject: 'Verify User Account From Authors Haven',
							html: `
                            <h1 style = "color:#4E9CAF;" > Welcome To Authors Haven </h1>
                            <a href ='${link}'
                            style="
                                width: 130 px;
                                height: 25 px;
                                background: #4E9CAF;
                                padding: 10px;
                                text-align: center;
                                border-radius: 5px;
                                color: white;
                                font-weight: bold;
                                text-decoration:none;
                            ">Activate account</a>
                            <br>
                            <br>
                        `
						};

						transporter.sendMail(mailOptions, function(error, info) {
							if (error) {
								res.status(404).json({
									err: error.message,
								});
							} else {
								res.status(201).json({
									success: true,
									userToken: token,
									message: 'Verification Email Has Been Successfully Sent'
								});
							}
						});
					}
				);
			})
			.catch((error) => res.status(400).send(error));
	}
}

const checkPasswordMatch = (user, res, isMatch) => {
	if (isMatch) {
		// Create JWT payload
		const payload = {
			id: user.id,
			username: user.username,
			avarta: user.avarta
		};
		// Generate the token or Sign Token
		jwt.sign(
			payload,
			process.env.SECRETKEY,
			{
				expiresIn: 3600
			},
			(err, token) => {
				res.json({
					success: true,
					token: 'Bearer ' + token
				});
			}
		);
	} else {
		return res.status(400).json({
			password: 'Password incorrect'
		});
	}
};

const handlePasswordHash = (req, res, avarta) => {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(req.body.password, salt, (err, hash) => {
			if (err) throw err;
			req.body.password = hash;
			UserController.handleUserCreation(req, res, avarta);
		});
	});
};
