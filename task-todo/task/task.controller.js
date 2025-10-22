const {
    getTaskService,
    createTaskService,
    getTasksByUserService,
    deleteTaskService,
    editTaskService
} = require('./task.service');


const getTaskController = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await getTaskService(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const createTaskController = async (req, res) => {
    const { userId, title, description } = req.body;

    if (!userId || !title || !description) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const newTask = await createTaskService(userId, title, description);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getTasksByUserController = async (req, res) => {
    const { userId } = req.params;

    try {
        const tasks = await getTasksByUserService(userId);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const deleteTaskController = async (req, res) => {
    const { taskId } = req.params;

    try {
        const deletedTask = await deleteTaskService(taskId);
        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(deletedTask);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const editTaskController = async (req, res) => {
    const { taskId } = req.params;
    const { title, description } = req.body;

    if (!title && !description) {
        return res.status(400).json({ error: 'At least one field must be provided for update' });
    }

    try {
        const updatedTask = await editTaskService(taskId, title, description);
        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getTaskController,
    createTaskController,
    getTasksByUserController,
    deleteTaskController,
    editTaskController
}