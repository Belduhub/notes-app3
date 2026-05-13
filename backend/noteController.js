const {
    getAllNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote
} = require('./noteModels');

// GET all notes
const getNotesController = async (req, res) => {
    try {
        const notes = await getAllNotes();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET note by ID
const getNoteByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await getNoteById(id);
        if (!note) {
            return res.status(404).json({ message: 'Catatan tidak ditemukan' });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST create note
const createNoteController = async (req, res) => {
    try {
        const { judul, isi } = req.body;
        if (!judul || !isi) {
            return res.status(400).json({ message: 'Judul dan isi harus diisi' });
        }
        const note = await createNote(judul, isi);
        res.status(201).json({
            message: 'Catatan berhasil ditambahkan',
            id: note.id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT update note
const updateNoteController = async (req, res) => {
    try {
        const { id } = req.params;
        const { judul, isi } = req.body;
        if (!judul || !isi) {
            return res.status(400).json({ message: 'Judul dan isi harus diisi' });
        }
        const note = await updateNote(id, judul, isi);
        if (note[0] === 0) {
            return res.status(404).json({ message: 'Catatan tidak ditemukan' });
        }
        res.json({ message: 'Catatan berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE note
const deleteNoteController = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await deleteNote(id);
        if (note === 0) {
            return res.status(404).json({ message: 'Catatan tidak ditemukan' });
        }
        res.json({ message: 'Catatan berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getNotesController,
    getNoteByIdController,
    createNoteController,
    updateNoteController,
    deleteNoteController
};
