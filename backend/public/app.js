const apiUrl = `${window.location.origin}/api/notes`;

const noteForm = document.getElementById('noteForm');
const notesList = document.getElementById('notesList');
const submitBtn = document.getElementById('submitBtn');

let editId = null; 
let allNotes = []; 

// Fungsi untuk mengambil dan menampilkan data (READ)
async function fetchNotes() {
    try {
        const response = await fetch(apiUrl);
        allNotes = await response.json();
        notesList.innerHTML = '';
        
        allNotes.forEach(note => {
            notesList.innerHTML += `
                <div class="note-card">
                    <h3 style="margin: 0 0 10px 0;">${note.judul}</h3>
                    <p style="margin: 0 0 10px 0;">${note.isi}</p>
                    <small style="color: gray;">Tanggal Dibuat: ${new Date(note.tanggal_dibuat).toLocaleString()}</small><br>
                    
                    <button class="btn-edit" onclick="siapkanEdit(${note.id})">Edit</button>
                    <button class="btn-hapus" onclick="hapusCatatan(${note.id})">Hapus</button>
                </div>
            `;
        });
    } catch (error) {
        console.error('Gagal mengambil data dari server:', error);
    }
}

// Fungsi untuk menambah atau memperbarui data (CREATE / UPDATE)
noteForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const judul = document.getElementById('judul').value;
    const isi = document.getElementById('isi').value;

    if (editId) {
        // Mode Update
        await fetch(`${apiUrl}/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ judul, isi })
        });
        editId = null;
        submitBtn.textContent = 'Tambah Catatan';
    } else {
        // Mode Create
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ judul, isi })
        });
    }

    noteForm.reset(); 
    fetchNotes(); 
});

// Fungsi untuk memuat data ke dalam form saat tombol Edit ditekan
window.siapkanEdit = function(id) {
    const note = allNotes.find(n => n.id === id);
    if(note) {
        editId = note.id;
        document.getElementById('judul').value = note.judul;
        document.getElementById('isi').value = note.isi;
        submitBtn.textContent = 'Perbarui Catatan'; 
    }
}

// Fungsi untuk menghapus data (DELETE)
async function hapusCatatan(id) {
    if(confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        fetchNotes();
    }
}

// Inisialisasi pengambilan data saat halaman pertama kali dimuat
fetchNotes();
