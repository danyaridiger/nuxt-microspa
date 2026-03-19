<template>
  <div class="notes-page">
    <div class="container py-4">
      <div class="header-wrapper mb-5">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <h1 class="page-title">
            <span class="title-icon">
              <i class="bi bi-journal-bookmark-fill"></i>
            </span>
            <span class="title-text">Мои заметки</span>
          </h1>
          <NuxtLink to="/notes/new" class="btn btn-create">
            <i class="bi bi-plus-lg"></i>
            <span>Создать заметку</span>
          </NuxtLink>
        </div>
        <div class="title-decoration"></div>
      </div>
      <div v-if="isLoading" class="loading-state">
        <div class="spinner">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
          <p class="mt-3 text-muted">Загружаем ваши заметки...</p>
        </div>
      </div>
      <div v-else-if="allNotes.length === 0" class="empty-state">
        <div class="empty-content">
          <div class="empty-icon">
            <i class="bi bi-journal-x"></i>
          </div>
          <h3>Здесь пока пусто</h3>
          <p class="text-muted">Создайте свою первую заметку, чтобы начать</p>
          <NuxtLink to="/notes/new" class="btn btn-outline-primary btn-lg">
            <i class="bi bi-plus-lg me-2"></i>
            <span>Создать первую заметку</span>
          </NuxtLink>
        </div>
      </div>
      <div v-else class="notes-grid-wrapper">
        <div class="row g-4 justify-content-center">
          <div
            v-for="note in allNotes"
            :key="note.id"
            class="col-12 col-md-6 col-lg-4 d-flex justify-content-center"
          >
            <NoteCard class="note-card-wrapper" :note="note" @delete="openDeleteModal" />
          </div>
        </div>
      </div>
      <ConfirmModal
        ref="deleteNoteModal"
        title="Удаление заметки"
        :message="`Вы уверены, что хотите удалить заметку &quot;${noteToDelete?.title}&quot;?`"
        @confirm="handleDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Note, ModalExposed } from "~/types/types";

const notesStore = useNotesStore();

const noteToDelete = ref<Note | null>(null);
const deleteNoteModal = useTemplateRef<ModalExposed>("deleteNoteModal");

const allNotes = computed(() => notesStore.allNotes);
const isLoading = computed(() => notesStore.isLoading);

const openDeleteModal = (note: Note): void => {
  noteToDelete.value = note;

  deleteNoteModal.value?.confirm();
};

const handleDelete = (): void => {
  if (noteToDelete.value) {
    notesStore.deleteNote(noteToDelete.value.id);

    noteToDelete.value = null;
  }
};

useHead({
  title: "Мои заметки — Task App",
  meta: [{ name: "description", content: "Управляйте своими заметками и задачами" }],
});

onMounted(() => {
  notesStore.loadNotes();
});
</script>
