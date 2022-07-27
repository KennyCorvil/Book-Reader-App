export default class NotesAPI {
    static getAllNotes() {
        const notes = JSON.parse(localStorage.getItem("notePad-notes") || "[]");

        return notes.sort((a, b) => {
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;//sorts the notes by date
        });
    }

    static saveNote(noteToSave) {
        const notes = NotesAPI.getAllNotes();
        const existing = notes.find(note => note.id == noteToSave.id)

        if(existing){
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.updated = new Date().toISOString();
        }else {
            noteToSave.id = Math.floor(Math.random() * 1000000);//generates random id
            noteToSave.updated = new Date().toISOString();//generates the date
    
            notes.push(noteToSave);//add noteTosave to the notes object
        }


        localStorage.setItem("notePad-notes", JSON.stringify(notes));// save it to the localStorage
    }

    static deleteNote(id) {
        const notes = NotesAPI.getAllNotes();
        const newNotes = notes.filter(note => note.id != id);

        localStorage.setItem("notePad-notes", JSON.stringify(newNotes));
    }
}