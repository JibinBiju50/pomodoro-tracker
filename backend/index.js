import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/db.js';
import User from './models/User.js';
import Task from './models/Task.js';

// Connect to MongoDB
connectDB();

const app = express();
const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//session middleware
app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge:1000 * 60 * 60 * 24 }
}));

//middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).send('Unauthorized, Please log in.');
    }
}

// Register route
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        //validate
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }
        if(password.length < 6){
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }
        
        const existingUser = await User.findOne({ username });
        if(existingUser){
            return res.status(400).json({ message: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            password: hashedPassword
        });

        req.session.userId = newUser._id;
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//login route
app.post('/api/login', async (req, res)=> {
    try{
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if(!user){
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        req.session.userId = user._id;
        res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//logout route
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if(err){
            return res.status(500).json({ message: 'Could not log out.' });
        }
        res.clearCookie('connect.sid');
        console.log("log out success");
        res.status(200).json({ message: 'Logout successful' });
    });
});

app.get('/api/dashboard', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.session.userId).select('-password');
    res.status(200).json({ message: `Welcome to your dashboard, ${user.username}`, user: { id: user._id, username: user.username } });
});

app.get('/api/auth-status', async (req, res) => {
    if(req.session.userId){
        const user = await User.findById(req.session.userId).select('-password');
        if(user){
            return res.status(200).json({ isAuthenticated: true, user: { id: user._id, username: user.username } });
        }
    }
    return res.status(200).json({ isAuthenticated: false });
});

// Get user profile
app.get('/api/profile', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user: { id: user._id, username: user.username, createdAt: user.createdAt } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update username
app.put('/api/profile/username', isAuthenticated, async (req, res) => {
    try {
        const { username } = req.body;

        if (!username || username.trim().length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters long.' });
        }

        // Check if username is already taken
        const existingUser = await User.findOne({ username, _id: { $ne: req.session.userId } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        const user = await User.findByIdAndUpdate(
            req.session.userId,
            { username: username.trim() },
            { new: true }
        ).select('-password');

        res.status(200).json({ message: 'Username updated successfully', user: { id: user._id, username: user.username } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update password
app.put('/api/profile/password', isAuthenticated, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
        }

        const user = await User.findById(req.session.userId);

        // Verify current password
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Current password is incorrect.' });
        }

        // Hash new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(req.session.userId, { password: hashedPassword });

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete account
app.delete('/api/profile', isAuthenticated, async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Password is required to delete account.' });
        }

        const user = await User.findById(req.session.userId);

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Password is incorrect.' });
        }

        await User.findByIdAndDelete(req.session.userId);

        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: 'Could not delete account.' });
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ message: 'Account deleted successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ============ TASK ROUTES ============

// Get all tasks for logged-in user
app.get('/api/tasks', isAuthenticated, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.session.userId }).sort({ createdAt: -1 });
        res.status(200).json({ tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Create a new task
app.post('/api/tasks', isAuthenticated, async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || title.trim() === '') {
            return res.status(400).json({ message: 'Task title is required.' });
        }

        const newTask = await Task.create({
            userId: req.session.userId,
            title: title.trim()
        });

        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update a task (title, completed status)
app.put('/api/tasks/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        const task = await Task.findOne({ _id: id, userId: req.session.userId });

        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        if (title !== undefined) task.title = title.trim();
        if (completed !== undefined) task.completed = completed;

        await task.save();

        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete a task
app.delete('/api/tasks/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOneAndDelete({ _id: id, userId: req.session.userId });

        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Increment pomodoro count for a task
app.put('/api/tasks/:id/pomodoro', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOneAndUpdate(
            { _id: id, userId: req.session.userId },
            { $inc: { pomodorosSpent: 1 } },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        res.status(200).json({ message: 'Pomodoro added', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});