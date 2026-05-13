const Notes = require('./schema/Notes');

// Get all notes
const getAllNotes = async () => {
    try {
        const notes = await Notes.findAll({
            order: [['tanggal_dibuat', 'DESC']]
        });
        return notes;
    } catch (error) {
        throw error;
    }
};

// Get note by ID
const getNoteById = async (id) => {
    try {
        const note = await Notes.findByPk(id);
        return note;
    } catch (error) {
        throw error;
    }
};

// Create new note
const createNote = async (judul, isi) => {
    try {
        const note = await Notes.create({
            judul,
            isi
        });
        return note;
    } catch (error) {
        throw error;
    }
};

// Update note
const updateNote = async (id, judul, isi) => {
    try {
        const note = await Notes.update(
            { judul, isi },
            { where: { id } }
        );
        return note;
    } catch (error) {
        throw error;
    }
};

// Delete note
const deleteNote = async (id) => {
    try {
        const note = await Notes.destroy({
            where: { id }
        });
        return note;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote
};
