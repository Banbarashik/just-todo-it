import { store } from '../../node_modules/reefjs/src/reef';
import { agentSmithObj, isToday } from './helper';
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
    sortingMethod: {
      name: 'default',
      order: 'ascending',
      defaultOrder: [],
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
      },
    ],
  },
  today: {
    id: 'today',
    title: 'Today',
    sortingMethod: {
      name: 'default',
      order: 'ascending',
      defaultOrder: [],
      body() {
        state.today.tasks.sort(
          (a, b) =>
            state.today.sortingMethod.defaultOrder.indexOf(a.id) -
            state.today.sortingMethod.defaultOrder.indexOf(b.id)
        );
      },
    },
    tasks: [],
  },
  projects: [
    {
      sortingMethod: {
        name: '',
        order: '',
        defaultOrder: [],
        body: function () {},
      },
      id: '2',
      title: 'Test',
      description: 'A test project',
      dueDate: {
        date: null,
        time: null,
      },
      tasks: [
        {
          id: '22',
          title: 'Stronglifts',
          description: 'Complete a set of exercises',
          dueDate: { date: '2022-11-09', time: '' },
        },
        {
          id: '33',
          title: 'Test task',
          description: '',
          dueDate: { date: '2022-11-09', time: '13:00' },
        },
        {
          id: '44',
          title: 'Test task2',
          description: '',
          dueDate: { date: '2022-11-09', time: '11:00' },
        },
        {
          id: '55',
          title: 'Test task3',
          description: '',
          dueDate: { date: '2022-11-10', time: '' },
        },
        {
          id: '66',
          title: 'Test task4',
          description: '',
          dueDate: { date: '2022-11-10', time: '12:00' },
        },
      ],
    },
  ],
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
          new Date(`${dateA}T${timeA ? timeA : '23:59:59.999'}Z`) -
          new Date(`${dateB}T${timeB ? timeB : '23:59:59.999'}Z`)
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
          new Date(`${dateB}T${timeB ? timeB : '23:59:59.999'}Z`) -
          new Date(`${dateA}T${timeA ? timeA : '23:59:59.999'}Z`)
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

export function setDefaultOrder(orderArr) {
  state.activeProject.sortingMethod.defaultOrder = orderArr;
}

export function setSortingMethod(
  nameAttr = 'default',
  orderAttr = 'ascending'
) {
  const { name, order, body } = sortingMethods.find(
    method => method.name === nameAttr && method.order === orderAttr
  );

  Object.assign(state.activeProject.sortingMethod, {
    name,
    order,
    body: body.bind(state.activeProject),
  });
}

export function setTodayTasks() {
  state.today.tasks = [state.inbox, ...state.projects]
    .map(project => project.tasks.filter(task => isToday(task.dueDate.date)))
    .flat();
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

export function addProject(formData) {
  const { title, description, date, time } = formData;

  const project = {
    id: Date.now().toString(),
    title,
    description,
    dueDate: {
      date,
      time,
    },
    sortingMethod: {
      name: '',
      order: '',
      defaultOrder: [],
      body: function () {},
    },
    tasks: [],
  };

  state.projects.push(project);
  state.activeProject = project;

  // Change ID in URL (doesn't invoke the 'hashchange' event)
  window.history.pushState(null, '', `#${project.id}`);
}

export function editProject(formData, project) {
  editItem(formData, project);
}

export function deleteProject(project) {
  const { id } = project;

  const index = state.projects.findIndex(project => project.id === id);

  state.projects.splice(index, 1);

  if (state.activeProject.id === id) state.activeProject = {};
}

export function addTask(formData) {
  const { project: projectId, title, description, date, time } = formData;

  const task = {
    id: Date.now().toString(),
    title,
    description,
    dueDate: {
      date,
      time,
    },
  };

  const project = [state.inbox, ...state.projects].find(
    project => project.id === projectId
  );

  project.tasks.push(task);
  if (state.activeProject.id === 'today') setTodayTasks();
}

export function editTask(formData, project, task) {
  editItem(formData, task);

  if (formData.project !== project.id) {
    const index = project.tasks.findIndex(taskEl => taskEl.id === task.id);
    project.tasks.splice(index, 1);

    const newProject = [state.inbox, ...state.projects].find(
      project => project.id === formData.project
    );
    newProject.tasks.push(task);
  }

  if (state.activeProject.id === 'today') setTodayTasks();
}

export function deleteTask(project, task) {
  const { id } = task;

  const index = project.tasks.findIndex(task => task.id === id);

  project.tasks.splice(index, 1);

  if (state.activeProject.id === 'today') setTodayTasks();
}
