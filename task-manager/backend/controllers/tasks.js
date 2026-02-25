const Task = require('../models/Task');

exports.getTasks = async (req, res, next) => {
    try {
        const Task = require('../models/Task');
        let query = Task.find({ user: req.user.id });
        if (req.query.search) query = query.find({ title: { $regex: req.query.search, $options: 'i' } });
        if (req.query.status) query = query.find({ status: req.query.status });

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const start = (page - 1) * limit;
        const total = await Task.countDocuments({ user: req.user.id });

        const tasks = await query.skip(start).limit(limit);
        res.status(200).json({
            success: true,
            count: tasks.length,
            pagination: {
                next: (start + limit) < total ? { page: page + 1, limit } : null,
                prev: start > 0 ? { page: page - 1, limit } : null
            },
            data: tasks
        });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.createTask = async (req, res, next) => {
    const Task = require('../models/Task');
    try {
        req.body.user = req.user.id;
        const task = await Task.create(req.body);
        res.status(201).json({ success: true, data: task });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.getTask = async (req, res) => {
    const Task = require('../models/Task');
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user.id) return res.status(404).json({ success: false });
    res.status(200).json({ success: true, data: task });
};

exports.updateTask = async (req, res) => {
    const Task = require('../models/Task');
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: task });
};

exports.deleteTask = async (req, res, next) => {
    try {
        console.log(`DELETE attempt for task: ${req.params.id} by user: ${req.user.id}`);
        const Task = require('../models/Task');
        const task = await Task.findById(req.params.id);

        if (!task) {
            console.log('Task not found');
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Make sure user owns the task
        if (task.user.toString() !== req.user.id) {
            console.log(`Unauthorized: Task belongs to ${task.user} but requested by ${req.user.id}`);
            return res.status(401).json({ success: false, message: 'Not authorized to delete this task' });
        }

        await Task.findByIdAndDelete(req.params.id);
        console.log('Task deleted successfully');

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error('Delete error:', err.message);
        res.status(400).json({ success: false, message: err.message });
    }
};
