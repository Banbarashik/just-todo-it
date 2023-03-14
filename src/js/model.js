import { store } from '../../node_modules/reefjs/src/reef';
import {
  agentSmithObj,
  isToday,
  storeInLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
  changeHash,
} from './helper';
export { default as ProjectControls } from './components/ProjectControls';
export { default as AddProjectModal } from './components/AddProjectModal';
export { default as EditProjectModal } from './components/EditProjectModal';
export { default as TaskControls } from './components/TaskControls';
export { default as AddTaskModal } from './components/AddTaskModal';
export { default as EditTaskModal } from './components/EditTaskModal';
export { default as SortingOptions } from './components/SortingOptions';

function retrieveProjectsFromLocalStorage() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const project = loadFromLocalStorage(key);
    key !== 'inbox' && key !== 'today'
      ? state.projects.push(project)
      : (state[key] = project);

    setSortingMethod(
      project.sortingMethod.name,
      project.sortingMethod.order,
      project
    );
  }
}

export const state = store({
  inbox: {
    id: 'inbox',
    title: 'Inbox',
    sortingMethod: {
      name: 'default',
      order: 'ascending',
      defaultOrder: ['11'],
      body() {
        state.inbox.tasks.sort(
          (a, b) =>
            state.inbox.sortingMethod.defaultOrder.indexOf(a.id) -
            state.inbox.sortingMethod.defaultOrder.indexOf(b.id)
        );
      },
    },
    tasks: [
      {
        id: '11',
        title: 'Create an inbox page',
        description: '',
        dueDate: {
          date: '2022-11-09',
          time: '11:09',
        },
        projectId: 'inbox',
        isCompleted: true,
      },
    ],
  },
  today: {
    id: 'today',
    title: 'Today',
    sortingMethod: {
      name: 'dueDate',
      order: 'ascending',
      body() {
        state.today.tasks.sort((a, b) => {
          const { date: dateA, time: timeA } = a.dueDate;
          const { date: dateB, time: timeB } = b.dueDate;

          return (
            new Date(
              `${dateA ? dateA : '2100-01-01'}T${
                timeA ? timeA : '23:59:59.999'
              }Z`
            ) -
            new Date(
              `${dateB ? dateB : '2100-01-01'}T${
                timeB ? timeB : '23:59:59.999'
              }Z`
            )
          );
        });
      },
    },
    tasks: [],
  },
  projects: [],
  activeProject: {},
});

const sortingMethods = [
  {
    name: 'dueDate',
    order: 'ascending',
    // this === project
    body() {
      this.tasks.sort((a, b) => {
        const { date: dateA, time: timeA } = a.dueDate;
        const { date: dateB, time: timeB } = b.dueDate;

        return (
          new Date(
            `${dateA ? dateA : '2100-01-01'}T${timeA ? timeA : '23:59:59.999'}Z`
          ) -
          new Date(
            `${dateB ? dateB : '2100-01-01'}T${timeB ? timeB : '23:59:59.999'}Z`
          )
        );
      });
    },
  },
  {
    name: 'dueDate',
    order: 'descending',
    // this === project
    body() {
      this.tasks.sort((a, b) => {
        const { date: dateA, time: timeA } = a.dueDate;
        const { date: dateB, time: timeB } = b.dueDate;

        return (
          new Date(
            `${dateB ? dateB : '2100-01-01'}T${timeB ? timeB : '23:59:59.999'}Z`
          ) -
          new Date(
            `${dateA ? dateA : '2100-01-01'}T${timeA ? timeA : '23:59:59.999'}Z`
          )
        );
      });
    },
  },
  {
    name: 'default',
    order: 'ascending',
    // this === project
    body() {
      this.tasks.sort(
        (a, b) =>
          this.sortingMethod.defaultOrder.indexOf(a.id) -
          this.sortingMethod.defaultOrder.indexOf(b.id)
      );
    },
  },
];

function init() {
  retrieveProjectsFromLocalStorage();
  state.projects.sort((a, b) => a.index - b.index);
}

init();

export function setDefaultOrder(orderArr, project = state.activeProject) {
  project.sortingMethod.defaultOrder = orderArr;
}

export function setSortingMethod(
  nameAttr = 'default',
  orderAttr = 'ascending',
  project = state.activeProject
) {
  const { name, order, body } = sortingMethods.find(
    method => method.name === nameAttr && method.order === orderAttr
  );

  Object.assign(project.sortingMethod, {
    name,
    order,
    body: body.bind(project),
  });

  project.sortingMethod.body();

  storeInLocalStorage(project.id, project);
}

export function setTodayTasks() {
  state.today.tasks = [state.inbox, ...state.projects]
    .map(project => project.tasks.filter(task => isToday(task.dueDate.date)))
    .flat();

  state.today.sortingMethod.body();
  storeInLocalStorage(state.today.id, state.today);
}

export function setProjectAsActive(id) {
  state.activeProject = [state.inbox, state.today, ...state.projects].find(
    project => project.id === id
  );
}

function editItem(formData, item) {
  // Create a copy of 'formData' obj
  const { date, time, ...formDataObj } = structuredClone(formData);
  // Format the copy obj's props to have the same structure as project obj
  formDataObj.dueDate = { date, time };

  agentSmithObj(formDataObj, item);
}

export function addProject({ title, description, date, time }) {
  const index =
    state.projects.length > 0
      ? state.projects[state.projects.length - 1].index + 1
      : 0;

  const project = {
    id: Date.now().toString(),
    title,
    description,
    dueDate: { date, time },
    index,
    tasks: [],
    sortingMethod: {
      name: 'default',
      order: 'ascending',
      defaultOrder: [],
      body: function () {},
    },
  };
  state.projects.push(project);

  changeHash(project.id);

  storeInLocalStorage(project.id, project);
}

export function editProject(formData, project) {
  editItem(formData, project);

  storeInLocalStorage(project.id, project);
}

export function deleteProject(project) {
  const { id } = project;
  const index = state.projects.findIndex(project => project.id === id);
  state.projects.splice(index, 1);
  if (state.activeProject.id === id) changeHash(state.inbox.id);

  removeFromLocalStorage(project.id);

  setTodayTasks();
}

function updateOnTaskChange(project) {
  project.sortingMethod.body();
  storeInLocalStorage(project.id, project);
  setTodayTasks();
}

export function addTask({ projectId, title, description, date, time }) {
  const task = {
    id: Date.now().toString(),
    title,
    description,
    dueDate: {
      date,
      time,
    },
    projectId,
    isCompleted: false,
  };

  const project = [state.inbox, ...state.projects].find(
    project => project.id === projectId
  );

  project.tasks.push(task);
  project.sortingMethod.defaultOrder.push(task.id);

  updateOnTaskChange(project);
}

export function editTask(formData, project, task) {
  editItem(formData, task);

  if (formData.projectId !== project.id) {
    deleteTask(project, task);

    const newProject = [state.inbox, ...state.projects].find(
      project => project.id === formData.projectId
    );
    newProject.tasks.push(task);
    newProject.sortingMethod.defaultOrder.push(task.id);

    updateOnTaskChange(newProject);
  }

  updateOnTaskChange(project);
}

export function deleteTask(project, task) {
  const { id } = task;
  const taskIndex = project.tasks.findIndex(task => task.id === id);
  const taskIdIndex = project.sortingMethod.defaultOrder.findIndex(
    id => id === task.id
  );

  project.tasks.splice(taskIndex, 1);
  project.sortingMethod.defaultOrder.splice(taskIdIndex, 1);

  updateOnTaskChange(project);
}

export function toggleTaskCompletion(task) {
  task.isCompleted = !task.isCompleted;
}
