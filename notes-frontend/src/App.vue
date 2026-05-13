<script setup>
import { ref, onMounted } from 'vue'

// State
const notes = ref([])
const loading = ref(false)
const error = ref('')

// Form state
const form = ref({ judul: '', isi: '' })
const editingId = ref(null)
const showForm = ref(false)

// API URL - Ganti ke URL Cloud Run atau Localhost sesuai kebutuhan
// Pastikan ada /api/notes di ujungnya ya!
const apiUrl = 'https://notes-backend-670153358279.asia-southeast2.run.app/api/notes'

const fetchNotes = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(apiUrl)
    if (!response.ok) throw new Error('Gagal fetch notes')
    notes.value = await response.json()
  } catch (err) {
    error.value = 'Gagal memuat catatan. Coba lagi.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const openAddForm = () => {
  editingId.value = null
  form.value = { judul: '', isi: '' }
  showForm.value = true
}

const openEditForm = (note) => {
  editingId.value = note.id
  form.value = { judul: note.judul, isi: note.isi }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingId.value = null
  form.value = { judul: '', isi: '' }
  error.value = ''
}

const submitForm = async () => {
  if (!form.value.judul.trim() || !form.value.isi.trim()) {
    error.value = 'Judul dan isi tidak boleh kosong.'
    return
  }
  error.value = ''
  try {
    if (editingId.value) {
      const response = await fetch(`${apiUrl}/${editingId.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      })
      if (!response.ok) throw new Error('Gagal update')
    } else {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      })
      if (!response.ok) throw new Error('Gagal create')
    }
    closeForm()
    await fetchNotes()
  } catch (err) {
    error.value = editingId.value ? 'Gagal mengubah.' : 'Gagal menambah.'
    console.error(err)
  }
}

const handleDelete = async (id) => {
  if (!confirm('Hapus catatan ini?')) return
  try {
    const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Gagal delete')
    await fetchNotes()
  } catch (err) {
    error.value = 'Gagal menghapus.'
    console.error(err)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('id-ID', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

onMounted(fetchNotes)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <header class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 sticky top-0 z-40 shadow-lg">
      <div class="px-8 py-8 text-center">
        <h1 class="text-4xl font-black text-white tracking-tight drop-shadow-lg">📝 CATATAN GWEJH</h1>
        <p class="text-indigo-100 font-medium text-sm uppercase tracking-widest mt-2">Sistem Informasi Catatan Digital</p>
      </div>
    </header>

    <div class="w-full py-12">
      <main class="px-6 lg:px-0">
        <div class="max-w-4xl mx-auto">
          
          <!-- Add Button -->
          <div class="mb-10 flex justify-center">
            <button @click="openAddForm" 
              class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black py-4 px-8 rounded-full shadow-lg hover:shadow-green-300 transition-all active:scale-95 flex items-center gap-3 text-lg">
              <span class="text-2xl">✨</span> BUAT CATATAN BARU
            </button>
          </div>

          <!-- Error Alert -->
          <div v-if="error" class="mb-8 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-2xl flex items-center justify-between text-sm shadow-md animate-bounce">
            <div class="flex items-center gap-3">
              <span class="text-2xl">⚠️</span>
              <span class="font-semibold">{{ error }}</span>
            </div>
            <button @click="error = ''" class="text-red-500 hover:text-red-700 font-bold text-xl">✕</button>
          </div>

          <!-- Form Modal -->
          <div v-if="showForm" class="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 transform transition-all animate-slideUp">
              <h2 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                {{ editingId ? '✏️ EDIT CATATAN' : '✨ CATATAN BARU' }}
              </h2>
              <div class="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6"></div>
              
              <div class="space-y-5 mb-8">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Judul Catatan</label>
                  <input v-model="form.judul" type="text" placeholder="Apa judulnya?"
                    class="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-black font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none" />
                </div>
                
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Isi Catatan</label>
                  <textarea v-model="form.isi" rows="6" placeholder="Tulis detailnya di sini..."
                    class="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"></textarea>
                </div>
              </div>

              <div class="flex gap-3">
                <button @click="closeForm" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black py-3 rounded-xl transition-all active:scale-95">BATAL</button>
                <button @click="submitForm" class="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black py-3 rounded-xl shadow-lg transition-all active:scale-95">
                  {{ editingId ? 'UPDATE' : 'SIMPAN' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Notes List Header -->
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">📚 DAFTAR ISI</h2>
            <span class="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold border-2 border-indigo-300">{{ notes.length }} Catatan</span>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-20">
            <div class="inline-block">
              <div class="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p class="text-gray-600 font-bold text-lg">Sinkronisasi data...</p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="notes.length === 0" class="text-center py-20 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-indigo-300 rounded-3xl">
            <p class="text-4xl mb-4">📭</p>
            <p class="text-gray-600 font-bold text-lg">Kosong melompong, bre.</p>
            <p class="text-gray-500 font-medium mt-2">Yuk ngetik catatan baru! ✨</p>
          </div>

          <!-- Notes Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="(note, index) in notes" :key="note.id"
              class="bg-white rounded-2xl border-2 border-gray-100 p-6 hover:border-indigo-400 hover:shadow-xl transition-all shadow-md hover:scale-105 flex flex-col justify-between cursor-pointer group animate-fadeIn"
              :style="{ 'animation-delay': `${index * 50}ms` }">
              
              <div class="mb-4">
                <div class="inline-block px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full text-xs font-bold text-indigo-700 mb-3">
                  {{ index + 1 }} dari {{ notes.length }}
                </div>
                <h3 class="font-black text-black text-xl mb-3 leading-tight group-hover:text-indigo-600 transition-colors">{{ note.judul }}</h3>
                <p class="text-gray-600 text-sm leading-relaxed line-clamp-3">{{ note.isi }}</p>
              </div>

              <div class="border-t-2 border-gray-100 pt-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">⏰ {{ formatDate(note.tanggal_dibuat) }}</p>
                <div class="flex gap-2">
                  <button @click="openEditForm(note)"
                    class="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-black py-3 rounded-lg text-sm transition-all active:scale-95 shadow-md">
                    ✏️ EDIT
                  </button>
                  <button @click="handleDelete(note.id)"
                    class="flex-1 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black py-3 rounded-lg text-sm transition-all active:scale-95 shadow-md">
                    🗑️ HAPUS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
* { font-family: 'Inter', sans-serif; }

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.4s ease-out;
}
</style>