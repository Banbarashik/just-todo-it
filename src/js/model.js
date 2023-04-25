import { store } from '../../node_modules/reefjs/src/reef';
import {
  agentSmithObj,
  isToday,
  storeInLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
  changeHash,
  generateID,
} from './helper';
export { default as ProjectControls } from './components/ProjectControls';
export { default as AddProjectModal } from './components/AddProjectModal';
export { default as EditProjectModal } from './components/EditProjectModal';
export { default as TaskControls } from './components/TaskControls';
export { default as AddTaskModal } from './components/AddTaskModal';
export { default as EditTaskModal } from './components/EditTaskModal';
export { default as SortingOptions } from './components/SortingOptions';

export const state = store({
  inbox: {
    id: 'inbox',
    title: 'Inbox',
    dueDate: { dateStr: '', time: '' },
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
          dateStr: '2022-11-09',
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
    dueDate: { dateStr: '', time: '' },
    sortingMethod: {
      name: 'dueDate',
      order: 'ascending',
      body() {
        state.today.tasks.sort((a, b) => {
          const { dateStr: dateA, time: timeA } = a.dueDate;
          const { dateStr: dateB, time: timeB } = b.dueDate;

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
    body() {
      // this === project
      // an arrow function is used so that 'this' is defined lexically
      // (the scope it was called from, in this case - project)
      this.tasks.sort((a, b) => {
        function createDate(dateStr, time) {
          const dateISO =
            `${dateStr ? dateStr : '2100-01-01'}` +
            `T${time ? time : '23:59:59.999'}Z`;

          return new Date(dateISO);
        }

        const dateA = createDate(a.dueDate.dateStr, a.dueDate.time);
        const dateB = createDate(b.dueDate.dateStr, b.dueDate.time);

        if (this.sortingMethod.order === 'ascending') return dateA - dateB;
        if (this.sortingMethod.order === 'descending') return dateB - dateA;
      });
    },
  },
  {
    name: 'default',
    body() {
      // this === project
      this.tasks.sort(
        (a, b) =>
          this.sortingMethod.defaultOrder.indexOf(a.id) -
          this.sortingMethod.defaultOrder.indexOf(b.id)
      );
    },
  },
];

export const getAllProjects = () => [...getProjectsWithOwnTasks(), state.today];
export const getProjectsWithOwnTasks = () => [state.inbox, ...state.projects];

function getProjectListItemIndex() {
  if (state.projects.length > 0) {
    const precedingProject = state.projects[state.projects.length - 1];

    return precedingProject.listItemIndex + 1;
  }

  return 0;
}

function retrieveProjectsFromLocalStorage() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const project = loadFromLocalStorage(key);

    if (key === state.inbox.id || key === state.today.id) state[key] = project;
    else state.projects.push(project);

    setSortingMethod(
      project,
      project.sortingMethod.name,
      project.sortingMethod.order
    );
  }
}

function editItem(formData, item) {
  // Create a copy of the 'formData' obj
  const { dateStr, time, ...formDataObj } = structuredClone(formData);
  // Format the copy obj's props to have the same structure as project obj
  formDataObj.dueDate = { dateStr, time };

  agentSmithObj(formDataObj, item);
}

// todo: think if it possible to create a class for creating project objects
function formatProjectObj(formData) {
  return {
    id: generateID(),
    title: formData.title,
    description: formData.description,
    dueDate: {
      dateStr: formData.date,
      time: formData.time,
    },
    listItemIndex: getProjectListItemIndex(),
    tasks: [],
    sortingMethod: {
      name: 'default',
      order: 'ascending',
      defaultOrder: [],
      body: function () {},
    },
  };
}

function formatTaskObj(formData) {
  return {
    id: generateID(),
    title: formData.title,
    description: formData.description,
    dueDate: {
      dateStr: formData.date,
      time: formData.time,
    },
    projectId: formData.projectId,
    isCompleted: false,
  };
}

// Updates to be made when a task changes (e.g., added, edited, deleted)
function updateStateOnTaskChange(project) {
  project.sortingMethod.body();
  storeInLocalStorage(project.id, project);
  setTodayTasks();
}

export function setDefaultOrder(project, order) {
  project.sortingMethod.defaultOrder = order;
}

export function setSortingMethod(
  project,
  name = 'default',
  order = 'ascending'
) {
  const { body } = sortingMethods.find(method => method.name === name);

  Object.assign(project.sortingMethod, {
    name,
    order,
    body: body.bind(project),
  });

  project.sortingMethod.body();

  storeInLocalStorage(project.id, project);
}

export function setTodayTasks() {
  state.today.tasks = getProjectsWithOwnTasks()
    .map(project => project.tasks.filter(task => isToday(task.dueDate.dateStr)))
    .flat();

  state.today.sortingMethod.body();
  storeInLocalStorage(state.today.id, state.today);
}

export function setProjectAsActive(id) {
  const project = getAllProjects().find(project => project.id === id);
  state.activeProject = project ? project : {};
}

export function addProject({ formData }) {
  const project = formatProjectObj(formData);

  setSortingMethod(project);
  state.projects.push(project);
  storeInLocalStorage(project.id, project);

  changeHash(project.id);
}

export function editProject({ formData, project }) {
  editItem(formData, project);
  storeInLocalStorage(project.id, project);
}

export function deleteProject({ project }) {
  const index = state.projects.findIndex(({ id }) => id === project.id);

  state.projects.splice(index, 1);
  removeFromLocalStorage(project.id);

  setTodayTasks(); // remove today's tasks that belonged to the deleted project

  if (state.activeProject.id === project.id) changeHash(state.inbox.id);
}

export function addTask({ formData, task = formatTaskObj(formData) }) {
  const project = getProjectsWithOwnTasks().find(
    ({ id }) => id === task.projectId
  );
  const updatedDefOrder = [...project.sortingMethod.defaultOrder, task.id];

  project.tasks.push(task);
  setDefaultOrder(project, updatedDefOrder);

  updateStateOnTaskChange(project);
}

export function editTask({ formData, project, task }) {
  editItem(formData, task);

  if (task.projectId !== project.id) {
    deleteTask(project, task);
    addTask({ task });
  }

  updateStateOnTaskChange(project);
}

export function deleteTask({ project, task }) {
  const taskIndex = project.tasks.findIndex(({ id }) => id === task.id);
  const updatedDefOrder = project.sortingMethod.defaultOrder.filter(
    id => id !== task.id
  );

  project.tasks.splice(taskIndex, 1);
  setDefaultOrder(project, updatedDefOrder);

  updateStateOnTaskChange(project);
}

export function toggleTaskCompletion(task) {
  task.isCompleted = !task.isCompleted;
}

function init() {
  retrieveProjectsFromLocalStorage();
  state.projects.sort((a, b) => a.listItemIndex - b.listItemIndex);
}

init();
