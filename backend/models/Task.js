import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    pomodorosSpent: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
