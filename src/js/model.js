import { store } from '../../node_modules/reefjs/src/reef';
// prettier-ignore
import { isToday, storeInLocalStorage, loadFromLocalStorage, removeFromLocalStorage, changeHash, generateID} from './helper';
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
            this.sortingMethod.defaultOrder.indexOf(a.id) -
            this.sortingMethod.defaultOrder.indexOf(b.id)
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
      project.id,
      project.sortingMethod.name,
      project.sortingMethod.order
    );
  }
}

function sortProjectsList() {
  state.projects.sort((a, b) => a.listItemIndex - b.listItemIndex);
}

// TODO think if it possible to create a class for creating project objects
function formatProjectObj(formData, project) {
  return {
    id: project ? project.id : generateID(),
    title: formData.title,
    description: formData.description,
    dueDate: {
      dateStr: formData.date,
      time: formData.time,
    },

    listItemIndex: project ? project.listItemIndex : getProjectListItemIndex(),

    tasks: project ? project.tasks : [],
    areCompletedTasksShown: true,

    sortingMethod: {
      name: 'default',
      order: 'ascending',
      defaultOrder: [],
      body: function () {},
    },
  };
}

function formatTaskObj(formData, task) {
  return {
    id: task ? task.id : generateID(),
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
function updateStateOnTaskChange(projectId) {
  const project = state.projects.find(project => project.id === projectId);

  project.sortingMethod.body();
  storeInLocalStorage(project.id, project);
  setTodayTasks();
}

export function setDefaultOrder(projectId, order) {
  const project = state.projects.find(project => project.id === projectId);

  project.sortingMethod.defaultOrder = order;
}

export function setSortingMethod(
  projectId,
  name = 'default',
  order = 'ascending'
) {
  const project = getAllProjects().find(project => project.id === projectId);

  const { body } = sortingMethods.find(method => method.name === name);

  Object.assign(project.sortingMethod, {
    name,
    order,
    body: body.bind(project),
  });

  project.sortingMethod.body();

  storeInLocalStorage(project.id, project);
}

export function toggleProjectCompletedTasks() {
  const project = state.activeProject;

  project.areCompletedTasksShown = !project.areCompletedTasksShown;
  storeInLocalStorage(project.id, project);
}

export function setTodayTasks() {
  state.today.tasks = getProjectsWithOwnTasks()
    .map(project =>
      project.tasks.filter(
        task => isToday(task.dueDate.dateStr) && !task.isCompleted
      )
    )
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

  state.projects.push(project);

  setSortingMethod(project.id);
  storeInLocalStorage(project.id, project);

  changeHash(project.id);
}

export function editProject({ formData, projectId }) {
  const index = state.projects.findIndex(project => project.id === projectId);
  state.projects[index] = formatProjectObj(formData, state.projects[index]);
  const project = state.projects[index];

  setProjectAsActive(project.id);
  storeInLocalStorage(project.id, project);
}

export function deleteProject({ projectId }) {
  const index = state.projects.findIndex(({ id }) => id === projectId);

  state.projects.splice(index, 1);
  removeFromLocalStorage(projectId);

  setTodayTasks(); // remove today's tasks that belong to the deleted project

  if (state.activeProject.id === projectId) changeHash(state.inbox.id);
}

export function addTask({ formData, task = formatTaskObj(formData) }) {
  const project = getProjectsWithOwnTasks().find(
    project => project.id === task.projectId
  );

  const updatedDefOrder = [...project.sortingMethod.defaultOrder, task.id];

  project.tasks.push(task);
  setDefaultOrder(project.id, updatedDefOrder);

  updateStateOnTaskChange(project.id);
}

function editItem(formattingFn, formData, itemsArr, itemIndex) {
  itemsArr[itemIndex] = formattingFn(formData, itemsArr[itemIndex]);
  return itemsArr[itemIndex];
}

export function editTask({ formData, projectId, taskId }) {
  const newProjectId = formData.projectId;

  const project = state.projects.find(project => project.id === projectId);
  const taskIndex = project.tasks.findIndex(task => task.id === taskId);
  // prettier-ignore
  const editedTask = editItem(formatTaskObj, formData, project.tasks, taskIndex);

  if (newProjectId !== projectId) {
    deleteTask({ projectId, taskId });
    addTask({ task: editedTask });
  }

  updateStateOnTaskChange(projectId);
}

export function deleteTask({ projectId, taskId }) {
  const project = state.projects.find(project => project.id === projectId);

  const taskIndex = project.tasks.findIndex(task => task.id === taskId);

  const updatedDefOrder = project.sortingMethod.defaultOrder.filter(
    id => id !== taskId
  );

  project.tasks.splice(taskIndex, 1);
  setDefaultOrder(projectId, updatedDefOrder);

  updateStateOnTaskChange(projectId);
}

export function toggleTaskCompletion(taskId, projectId) {
  const project = state.projects.find(project => project.id === projectId);

  const task = project.tasks.find(task => task.id === taskId);

  task.isCompleted = !task.isCompleted;

  updateStateOnTaskChange(this.state.activeProject);
}

function init() {
  retrieveProjectsFromLocalStorage();
  sortProjectsList();
}

init();
