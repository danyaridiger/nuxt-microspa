<template>
  <div class="note-edit-page">
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <div class="edit-card">
            <div class="edit-card-header">
              <div class="header-icon">
                <i :class="isNew ? 'bi-plus-circle' : 'bi-pencil-square'"></i>
              </div>
              <h2 class="header-title">
                {{ isNew ? "Создание новой заметки" : "Редактирование заметки" }}
              </h2>
              <div class="header-decoration"></div>
            </div>
            <div class="edit-card-body">
              <form @submit.prevent="saveNote">
                <div class="mb-4">
                  <label for="noteTitle" class="form-label">
                    <i class="bi bi-heading me-2"></i>
                    <span>Заголовок</span>
                  </label>
                  <input
                    type="text"
                    class="form-control form-control-lg title-input"
                    id="noteTitle"
                    placeholder="Например: План на день, Идеи для проекта..."
                    v-model="noteForm.title"
                    required
                    @change="saveToHistory"
                  />
                </div>
                <div class="mb-4">
                  <label class="form-label">
                    <i class="bi bi-check2-square me-2"></i>
                    <span>Задачи</span>
                  </label>
                  <div class="task-list-wrapper mb-3" v-if="noteForm.tasks.length > 0">
                    <div class="task-list">
                      <TaskItem
                        v-for="task in noteForm.tasks"
                        :key="task.id"
                        :task="task"
                        @update="updateTask"
                        @delete="deleteTask"
                      />
                    </div>
                  </div>
                  <div v-else class="empty-tasks">
                    <i class="bi bi-inbox"></i>
                    <p class="mb-0">Нет задач. Добавьте первую задачу ниже.</p>
                  </div>
                  <div class="add-task">
                    <div class="input-group">
                      <input
                        type="text"
                        class="form-control task-input"
                        v-model="newTaskText"
                        placeholder="Введите новую задачу..."
                        @keyup.enter="addTask"
                      />
                      <button
                        class="btn btn-add-task"
                        type="button"
                        :disabled="!newTaskText.trim()"
                        @click="addTask"
                      >
                        <i class="bi bi-plus-lg"></i>
                        <span>Добавить</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="history-info" v-if="history.length > 0 || future.length > 0">
                  <div class="history-stats">
                    <span>
                      <i class="bi bi-arrow-return-left"></i>
                      <span>Шагов назад: {{ history.length }}</span>
                    </span>
                    <span>
                      <i class="bi bi-arrow-return-right"></i>
                      <span>Шагов вперед: {{ future.length }}</span>
                    </span>
                  </div>
                </div>
                <div class="actions-grid">
                  <button type="submit" class="btn-action btn-save">
                    <i class="bi bi-check-lg"></i>
                    <span>Сохранить</span>
                  </button>
                  <button
                    type="button"
                    class="btn-action btn-undo"
                    title="Ctrl+Z"
                    :disabled="!canUndo"
                    @click="undo"
                  >
                    <i class="bi bi-arrow-counterclockwise"></i>
                    <span>Отменить</span>
                  </button>
                  <button
                    type="button"
                    class="btn-action btn-redo"
                    title="Ctrl+Shift+Z"
                    :disabled="!canRedo"
                    @click="redo"
                  >
                    <i class="bi bi-arrow-clockwise"></i>
                    <span>Повторить</span>
                  </button>
                  <button
                    type="button"
                    class="btn-action btn-cancel"
                    @click="confirmCancel"
                  >
                    <i class="bi bi-x-lg"></i>
                    <span>Отмена</span>
                  </button>
                  <button
                    v-if="!isNew"
                    type="button"
                    class="btn-action btn-delete"
                    @click="confirmDelete"
                  >
                    <i class="bi bi-trash"></i>
                    <span>Удалить</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ConfirmModal
      ref="cancelModal"
      title="Отмена редактирования"
      message="Все несохраненные изменения будут потеряны. Продолжить?"
      @confirm="cancelEdit"
    />
    <ConfirmModal
      ref="deleteModal"
      title="Удаление заметки"
      message="Вы уверены, что хотите удалить эту заметку? Это действие нельзя отменить."
      @confirm="deleteNote"
    />
  </div>
</template>

<script setup lang="ts">
import type { NoteFormData, Task, ModalExposed } from "~/types/types";

const notesStore = useNotesStore();
const route = useRoute();

const cancelModal = useTemplateRef<ModalExposed>("cancelModal");
const deleteModal = useTemplateRef<ModalExposed>("deleteModal");

const noteForm = ref<NoteFormData>({
  title: "",
  tasks: [],
});

const history = ref<NoteFormData[]>([]);
const future = ref<NoteFormData[]>([]);
const newTaskText = ref<string>("");
const prevTitle = ref<string>("");

const isNew = computed(() => route.params.id === "new");
const noteId = computed(() => (isNew.value ? null : (route.params.id as string)));
const canUndo = computed(() => history.value.length > 0);
const canRedo = computed(() => future.value.length > 0);

const saveToHistory = (): void => {
  history.value.push({
    title: prevTitle.value,
    tasks: [...noteForm.value.tasks],
  });

  prevTitle.value = noteForm.value.title;
  future.value = [];
};

const addTask = (): void => {
  const text = newTaskText.value.trim();

  if (text) {
    saveToHistory();
    noteForm.value.tasks.push({
      id: Date.now(),
      text,
      completed: false,
    });

    newTaskText.value = "";
  }
};

const updateTask = (updatedTask: Task): void => {
  saveToHistory();

  const index = noteForm.value.tasks.findIndex((t) => t.id === updatedTask.id);

  if (index !== -1) {
    noteForm.value.tasks[index] = updatedTask;
  }
};

const deleteTask = (taskId: number): void => {
  saveToHistory();

  noteForm.value.tasks = noteForm.value.tasks.filter((t) => t.id !== taskId);
};

const undo = (): void => {
  if (history.value.length > 0) {
    future.value.push({
      title: noteForm.value.title,
      tasks: [...noteForm.value.tasks],
    });

    const prevState = history.value.pop();

    if (prevState) {
      noteForm.value = prevState;
    }
  }
};

const redo = (): void => {
  if (future.value.length > 0) {
    history.value.push({
      title: noteForm.value.title,
      tasks: [...noteForm.value.tasks],
    });

    const nextState = future.value.pop();

    if (nextState) {
      noteForm.value = nextState;
    }
  }
};

const handleKeyDown = (e: KeyboardEvent): void => {
  if (e.ctrlKey && e.key === "z" && !e.shiftKey) {
    e.preventDefault();
    undo();
  } else if (e.ctrlKey && e.shiftKey && e.key === "Z") {
    e.preventDefault();
    redo();
  }
};

const saveNote = (): void => {
  if (!noteForm.value.title.trim()) return;

  if (isNew.value) {
    notesStore.createNote({
      title: noteForm.value.title,
      tasks: noteForm.value.tasks,
    });
  } else if (noteId.value) {
    notesStore.updateNote(noteId.value, {
      title: noteForm.value.title,
      tasks: noteForm.value.tasks,
    });
  }

  navigateTo("/");
};

const confirmCancel = (): void => {
  cancelModal.value?.confirm();
};

const confirmDelete = (): void => {
  deleteModal.value?.confirm();
};

const cancelEdit = (): void => {
  navigateTo("/");
};

const deleteNote = (): void => {
  if (noteId.value) {
    notesStore.deleteNote(noteId.value);
  }

  navigateTo("/");
};

watchEffect(() => {}, {
  flush: "post",
});

useHead({
  title: computed(() => (isNew.value ? "Создание заметки" : "Редактирование заметки")),
});

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);

  const note = notesStore.loadNote(route.params.id as string);

  if (note) {
    noteForm.value = {
      title: note.title,
      tasks: [...note.tasks],
    };
    prevTitle.value = note.title;
  } else if (route.params.id !== "new") {
    navigateTo("/");
  }
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>
