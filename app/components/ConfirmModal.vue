<template>
  <div
    class="modal fade"
    ref="modal"
    tabindex="-1"
    aria-hidden="true"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content custom-modal">
        <div class="modal-header">
          <div class="modal-icon" :class="typeClass">
            <i :class="iconClass"></i>
          </div>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h5 class="modal-title">{{ title }}</h5>
          <p class="modal-message">{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-cancel" data-bs-dismiss="modal">
            <i class="bi bi-x-lg me-2"></i>
            <span>Отмена</span>
          </button>
          <button
            type="button"
            class="btn btn-confirm"
            :class="confirmButtonClass"
            data-bs-dismiss="modal"
            @click="handleConfirm"
          >
            <i :class="confirmIconClass" class="me-2"></i>
            <span>Подтвердить</span>
          </button>
        </div>
        <div class="modal-decoration"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ModalType } from "~/types/types";

import { Modal } from "bootstrap";

interface Props {
  title?: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
}

interface Emits {
  (e: "confirm"): void;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Подтверждение",
  type: "warning",
  confirmText: "Подтвердить",
});

const emit = defineEmits<Emits>();

const modal = useTemplateRef("modal");

const iconClass = computed(() => {
  const icons = {
    warning: "bi-exclamation-triangle-fill",
    danger: "bi-trash3-fill",
    info: "bi-info-circle-fill",
    success: "bi-check-circle-fill",
  };

  return icons[props.type];
});

const typeClass = computed(() => {
  const classes = {
    warning: "warning",
    danger: "danger",
    info: "info",
    success: "success",
  };

  return classes[props.type];
});

const confirmButtonClass = computed(() => {
  const classes = {
    warning: "btn-warning",
    danger: "btn-danger",
    info: "btn-info",
    success: "btn-success",
  };

  return classes[props.type];
});

const confirmIconClass = computed(() => {
  const icons = {
    warning: "bi-exclamation-circle",
    danger: "bi-trash",
    info: "bi-info-circle",
    success: "bi-check-circle",
  };

  return icons[props.type];
});

const handleConfirm = (): void => {
  emit("confirm");
};

const confirm = (): void => {
  if (modal.value) {
    const modalInstance = new Modal(modal.value);

    modalInstance.show();
  }
};

defineExpose({
  confirm,
});
</script>
