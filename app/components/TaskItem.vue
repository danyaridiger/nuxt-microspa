<template>
  <div class="task-item d-flex align-items-center mb-2 p-2 border rounded">
    <div class="form-check flex-grow-1">
      <input
        type="checkbox"
        class="form-check-input"
        :id="'task-' + task.id"
        :checked="task.completed"
        @change="toggleComplete"
      />
      <label
        class="form-check-label ms-2"
        :class="{ 'text-decoration-line-through text-muted': task.completed }"
        :for="'task-' + task.id"
      >
        <span v-if="!editing">{{ task.text }}</span>
        <input
          v-else
          type="text"
          class="form-control form-control-sm d-inline-block w-auto"
          ref="editInput"
          v-model="editText"
          @blur="saveEdit"
          @keyup.enter="saveEdit"
          @keyup.esc="cancelEdit"
        />
      </label>
    </div>
    <div class="btn-group btn-group-sm ms-2">
      <button
        v-if="!editing"
        type="button"
        class="btn btn-outline-primary"
        title="Редактировать"
        @click="startEdit"
      >
        <i class="bi bi-pencil"></i>
      </button>
      <button
        type="button"
        class="btn btn-outline-danger"
        title="Удалить"
        @click="deleteTask"
      >
        <i class="bi bi-trash"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from "~/types/types";

import { ref, nextTick } from "vue";

interface Props {
  task: Task;
}

interface Emits {
  (e: "update", task: Task): void;
  (e: "delete", id: number): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const editing = ref<boolean>(false);
const editText = ref<string>(props.task.text);
const editInput = useTemplateRef("editInput");

const toggleComplete = (event: Event): void => {
  const target = event.target as HTMLInputElement;

  emit("update", {
    ...props.task,
    completed: target.checked,
  });
};

const startEdit = (): void => {
  editing.value = true;
  editText.value = props.task.text;

  nextTick((): void => {
    editInput.value?.focus();
  });
};

const saveEdit = (): void => {
  const trimmedText = editText.value.trim();

  if (trimmedText && trimmedText !== props.task.text) {
    emit("update", {
      ...props.task,
      text: trimmedText,
    });
  }

  editing.value = false;
};

const cancelEdit = (): void => {
  editText.value = props.task.text;
  editing.value = false;
};

const deleteTask = (): void => {
  emit("delete", props.task.id);
};
</script>
