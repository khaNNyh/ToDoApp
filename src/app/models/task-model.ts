export interface task {
  id: number;
  content: string;
  state: taskState;
  subtasks?: task[];
}

export enum taskState {
  DONE = 'DONE',
  NOTDONE = 'NOTDONE',
}
