import axios from 'axios'

const api = axios.create({
  // Ini bakal manggil VITE_API_BASE_URL dari file .env tadi
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Fungsi-fungsi buat CRUD ke backend
export const getNotes = () => api.get('/notes')
export const getNoteById = (id) => api.get(`/notes/${id}`)
export const createNote = (data) => api.post('/notes', data)
export const updateNote = (id, data) => api.put(`/notes/${id}`, data)
export const deleteNote = (id) => api.delete(`/notes/${id}`)