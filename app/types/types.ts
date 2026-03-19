export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface NoteFormData {
  title: string;
  tasks: Task[];
}

export interface NoteState {
  notes: Note[];
  note: Note | undefined;
  loaded: boolean;
}

export interface ModalExposed {
  confirm: () => void;
}

export type ModalType = "warning" | "danger" | "info" | "success";
