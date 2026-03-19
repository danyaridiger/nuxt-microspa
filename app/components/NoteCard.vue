<template>
  <div class="note-card card h-100 border-0 shadow-sm">
    <div class="card-body d-flex flex-column">
      <div class="d-flex align-items-start justify-content-between mb-3">
        <div class="d-flex align-items-center gap-2">
          <div class="note-icon">
            <i class="bi bi-journal-bookmark-fill text-primary"></i>
          </div>
          <h5 class="card-title mb-0 fw-semibold">{{ note.title }}</h5>
        </div>
        <div class="task-badge" :class="getBadgeClass">
          <i class="bi bi-check2-circle me-1"></i>
          <span>{{ note.tasks.length }}</span>
        </div>
      </div>
      <div class="d-flex align-items-center text-muted small mb-3">
        <i class="bi bi-clock-history me-1"></i>
        <span>{{ formatDate(note.updatedAt) }}</span>
      </div>
      <div class="task-preview flex-grow-1 mb-3">
        <div
          v-for="task in previewTasks"
          :key="task.id"
          class="task-item d-flex align-items-center gap-2 py-1"
        >
          <div class="task-icon" :class="{ completed: task.completed }">
            <i class="bi" :class="getTaskIcon(task)"></i>
          </div>
          <span
            class="task-text small"
            :class="{ 'text-decoration-line-through text-muted': task.completed }"
          >
            {{ task.text }}
          </span>
        </div>
        <div v-if="note.tasks.length > 3" class="more-tasks mt-2">
          <span class="badge bg-light text-dark">
            <i class="bi bi-plus-circle me-1"></i>
            <span>ещё {{ note.tasks.length - 3 }}</span>
          </span>
        </div>
        <div v-if="note.tasks.length === 0" class="empty-tasks text-center py-3">
          <div class="empty-icon mb-2">
            <i class="bi bi-inbox fs-2 text-muted"></i>
          </div>
          <p class="small text-muted mb-0">Нет задач</p>
        </div>
      </div>
      <div
        class="d-flex justify-content-end gap-2 mt-auto pt-2 border-top cursor-pointer"
      >
        <NuxtLink
          class="btn btn-sm btn-outline-primary rounded-pill px-3"
          title="Редактировать"
          :to="`/notes/${note.id}`"
        >
          <i class="bi bi-pencil me-1"></i>
          <span class="d-none d-sm-inline">Редактировать</span>
        </NuxtLink>
        <button
          class="btn btn-sm btn-outline-danger rounded-pill px-3 cursor-pointer"
          title="Удалить"
          @click="confirmDelete"
        >
          <i class="bi bi-trash me-1"></i>
          <span class="d-none d-sm-inline">Удалить</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Note, Task } from "~/types/types";

import { computed } from "vue";

interface Props {
  note: Note;
}

interface Emits {
  (e: "delete", note: Note): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const getBadgeClass = computed(() => {
  const count = props.note.tasks.length;

  if (count === 0) return "bg-soft-secondary";
  if (count <= 3) return "bg-soft-success";
  if (count <= 7) return "bg-soft-warning";

  return "bg-soft-danger";
});

const previewTasks = computed(() => {
  return props.note.tasks.slice(0, 3);
});

const getTaskIcon = (task: Task) => {
  if (task.completed) {
    const icons = ["bi-emoji-smile", "bi-stars", "bi-award", "bi-gem", "bi-flag"];

    return icons[task.id % icons.length];
  } else {
    const icons = [
      "bi-lightbulb",
      "bi-pencil",
      "bi-telephone",
      "bi-envelope",
      "bi-calendar-check",
      "bi-cart",
      "bi-book",
      "bi-cup-hot",
    ];

    return icons[task.id % icons.length];
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const dateReadable = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  if (diffDays === 0) {
    return `Сегодня в ${dateReadable}`;
  }

  if (diffDays === 1) {
    return `Вчера в ${dateReadable}`;
  }

  return dateReadable;
};

const confirmDelete = (): void => {
  emit("delete", props.note);
};
</script>
