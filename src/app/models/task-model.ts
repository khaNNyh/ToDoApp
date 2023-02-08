export interface task {
  _id: string;
  _listId: string;
  title: string;
  done: boolean;
  note: string;
  dueDate: Date;
  subtasks?: task[];
}

export interface list {
  _id: string;
  title: string;
  done: boolean;
}
