const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {
    sendVerificationEmail
} = require('../utils/mailer');

const generateToken = (user) => {
    return jwt.sign({
            id: user._id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET, {
            expiresIn: '7d'
        }
    );
};

const makeCode = () => String(Math.floor(100000 + Math.random() * 900000));

exports.register = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        const existingUser = await User.findOne({
            email
        });
        if (existingUser) {
            return res.status(400).json({
                error: 'Email already exists'
            });
        }

        const code = makeCode();
        const user = new User({
            name,
            email,
            password,
            isVerified: false,
            verificationCode: code,
            verificationExpires: new Date(Date.now() + 10 * 60 * 1000)
        });
        await user.save();

        await sendVerificationEmail(email, code);

        res.status(201).json({
            message: 'Registration successful. Please verify your email.',
            email: user.email,
            needsVerification: true
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const {
            email,
            code
        } = req.body;

        const user = await User.findOne({
            email
        });
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                error: 'Email already verified'
            });
        }

        if (!user.verificationCode || user.verificationCode !== String(code).trim()) {
            return res.status(400).json({
                error: 'Invalid verification code'
            });
        }

        if (!user.verificationExpires || user.verificationExpires < new Date()) {
            return res.status(400).json({
                error: 'Verification code expired'
            });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationExpires = undefined;
        await user.save();

        const token = generateToken(user);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                reputation: user.reputation || 0,
                bio: user.bio || '',
                location: user.location || '',
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.resendCode = async (req, res) => {
    try {
        const {
            email
        } = req.body;

        const user = await User.findOne({
            email
        });
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                error: 'Email already verified'
            });
        }

        const code = makeCode();
        user.verificationCode = code;
        user.verificationExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await sendVerificationEmail(email, code);

        res.json({
            message: 'Verification code resent'
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const user = await User.findOne({
            email
        });
        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                error: 'Please verify your email before logging in',
                needsVerification: true,
                email: user.email
            });
        }

        const token = generateToken(user);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -verificationCode');
        res.json(user);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const {
            name,
            email,
            bio,
            location
        } = req.body;
        const user = await User.findById(req.user.id);

        if (name) user.name = name;
        if (email) user.email = email;
        if (bio !== undefined) user.bio = bio;
        if (location !== undefined) user.location = location;

        await user.save();
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            reputation: user.reputation || 0,
            bio: user.bio || '',
            location: user.location || '',
            createdAt: user.createdAt
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password -verificationCode')
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};