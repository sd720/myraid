const express = require('express');
const { getTasks, getTask, createTask, updateTask, deleteTask } = require('../controllers/tasks');
const { protect } = require('../middleware/auth');
const { decryptBody, encryptResponse } = require('../middleware/encryption');

const router = express.Router();

router.use(protect); // All task routes are protected

router.route('/')
    .get(encryptResponse(['description']), getTasks)
    .post(decryptBody(['description']), createTask);

router.route('/:id')
    .get(encryptResponse(['description']), getTask)
    .put(decryptBody(['description']), updateTask)
    .delete(deleteTask);

module.exports = router;
