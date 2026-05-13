const express = require('express');
const {
    getNotesController,
    getNoteByIdController,
    createNoteController,
    updateNoteController,
    deleteNoteController
} = require('../backend/noteController');

const router = express.Router();

// Routes
router.get('/', getNotesController);
router.get('/:id', getNoteByIdController);
router.post('/', createNoteController);
router.put('/:id', updateNoteController);
router.delete('/:id', deleteNoteController);

module.exports = router;
