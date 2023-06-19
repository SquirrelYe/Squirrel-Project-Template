class RequestTaskKeyStore {
  constructor(keys = []) {
    this.taskKeyStore = keys;
  }
  setRequestTaskStorage(taskArr, taskKey) {
    taskKey && taskArr.push(taskKey);
    this.taskKeyStore = taskArr;
  }
  removeRequestTaskKey(taskKey) {
    if (!taskKey) return;
    let taskArr = [...this.taskKeyStore];
    const index = taskArr.indexOf(taskKey);
    if (~index) {
      taskArr.splice(index, 1);
      this.setRequestTaskStorage(taskArr);
    }
  }
  requestTaskStorage(taskKey) {
    let result = false;
    if (!taskKey) return result;
    let taskArr = [...this.taskKeyStore];
    if (taskArr.length > 0) {
      if (~taskArr.indexOf(taskKey)) {
        result = true;
      } else {
        this.setRequestTaskStorage(taskArr, taskKey);
      }
    } else {
      taskKey && this.setRequestTaskStorage(taskArr, taskKey);
    }
    return result;
  }
}
export default function createTaskKeyStore(keys = []) {
  return new RequestTaskKeyStore(keys);
}
