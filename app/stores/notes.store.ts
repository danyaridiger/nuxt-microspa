import type { Note, NoteState, NoteFormData, Task } from "~/types/types";

export const useNotesStore = defineStore("notes", {
  state: (): NoteState => ({
    notes: <Note[]>[],
    note: undefined,
    loaded: false,
  }),

  getters: {
    getNoteById:
      (state: NoteState) =>
      (id: string): Note | undefined => {
        return state.notes.find((note) => note.id === id);
      },
    allNotes: (state): Note[] => state.notes,
    getNote: (state) => state.note,
    isLoading: (state): boolean => !state.loaded,
  },

  actions: {
    loadNotes(): void {
      if (process.client) {
        try {
          const saved = localStorage.getItem("notes");

          if (saved) {
            this.notes = JSON.parse(saved) as Note[];
          }
        } catch (error) {
          console.error("Failed to load notes:", error);

          this.notes = [];
        } finally {
          this.loaded = true;
        }
      }
    },

    saveNotes(): void {
      if (process.client) {
        try {
          localStorage.setItem("notes", JSON.stringify(this.notes));
        } catch (error) {
          console.error("Failed to save notes:", error);
        }
      }
    },

    loadNote(id: string): Note | undefined {
      if (process.client) {
        try {
          const saved = localStorage.getItem("notes");

          if (saved) {
            const note = JSON.parse(saved).find((n: Note) => n.id === id);

            this.note = note;
          }
        } catch (error) {
          console.error("Failed to load notes:", error);

          this.notes = [];
        } finally {
          this.loaded = true;

          return this.note;
        }
      }
    },

    createNote(noteData: NoteFormData): Note {
      const newNote: Note = {
        id: Date.now().toString(),
        title: noteData.title,
        tasks: noteData.tasks || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.notes.push(newNote);
      this.saveNotes();

      return newNote;
    },

    updateNote(id: string, updatedData: Partial<NoteFormData>): boolean {
      const index = this.notes.findIndex((n) => n.id === id);

      if (index !== -1) {
        this.notes[index] = {
          ...this.notes[index],
          ...updatedData,
          updatedAt: new Date().toISOString(),
        } as Note;

        this.saveNotes();

        return true;
      }

      return false;
    },

    deleteNote(id: string): boolean {
      const initialLength = this.notes.length;

      this.notes = this.notes.filter((n) => n.id !== id);

      if (this.notes.length !== initialLength) {
        this.saveNotes();

        return true;
      }

      return false;
    },

    addtask(noteId: string, taskText: string): boolean {
      const note = this.getNoteById(noteId);

      if (note) {
        const newtask: Task = {
          id: Date.now(),
          text: taskText,
          completed: false,
        };

        note.tasks.push(newtask);

        note.updatedAt = new Date().toISOString();

        this.saveNotes();

        return true;
      }

      return false;
    },

    updatetask(noteId: string, updatedtask: Task): boolean {
      const note = this.getNoteById(noteId);

      if (note) {
        const taskIndex = note.tasks.findIndex((t) => t.id === updatedtask.id);

        if (taskIndex !== -1) {
          note.tasks[taskIndex] = updatedtask;
          note.updatedAt = new Date().toISOString();

          this.saveNotes();

          return true;
        }
      }

      return false;
    },

    deletetask(noteId: string, taskId: number): boolean {
      const note = this.getNoteById(noteId);

      if (note) {
        note.tasks = note.tasks.filter((t) => t.id !== taskId);
        note.updatedAt = new Date().toISOString();

        this.saveNotes();

        return true;
      }

      return false;
    },
  },
});
