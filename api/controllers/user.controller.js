import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return next(errorHandler(400, "All fields are required"));
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ email, password: hashedPassword, role });
        await newUser.save();
        res.status(200).json('User created successfully');

    } catch (error) {
        if (error.code === 11000) {
            next(errorHandler(403, 'Email is already exists!!'))
        } else {
            next(error);
        }
    }
};

export const login = async (req, res, next) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return next(errorHandler(400, "All fields are required"));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'User not found!!'))
        }

        if (validUser.role !== role) {
            return next(errorHandler(401, "Invalid role"));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(404, 'Invalid credential'))
        }

        const token = jwt.sign({ id: validUser._id, role: validUser.role, }, process.env.JWT_SECRET, { expiresIn: '2d' });

        const { password: pass, ...rest } = validUser._doc;

        res.cookie('access_token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        }).status(200).json(rest);

    } catch (error) {
        next(error)
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 30;
        const skip = (page - 1) * limit;

        const searchQuery = req.query.search || '';
        const roleQuery = req.query.role || '';

        const query = {};

        if (searchQuery) {
            query.$or = [
                { email: { $regex: searchQuery, $options: 'i' } },
            ];
        }

        if (roleQuery) {
            query.role = roleQuery;
        }

        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);

        res.json({
            users,
            currentPage: page,
            totalPages,
            totalUsers: total
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ success: false, message: 'Failed to delete issue' });
    }
};

export const signout = (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('User Logged out!')
    } catch (error) {
        next(error);
    }
};