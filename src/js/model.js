import { store } from '../../node_modules/reefjs/src/reef';
import { agentSmithObj, isToday } from './helper';
export { default as ProjectControls } from './components/ProjectControls';
export { default as AddProjectModal } from './components/AddProjectModal';
export { default as EditProjectModal } from './components/EditProjectModal';
export { default as TaskControls } from './components/TaskControls';
export { default as AddTaskModal } from './components/AddTaskModal';
export { default as EditTaskModal } from './components/EditTaskModal';

export const state = store({
  inbox: {
    id: 'inbox',
    title: 'Inbox',
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
    tasks: [],
  },
  projects: [
    {
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
      ],
    },
  ],
  activeProject: {},
});

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
  const formDataObj = structuredClone(formData);
  // Format the copy obj props to have the same structure as project obj
  formDataObj.dueDate = {
    date: formDataObj.date,
    time: formDataObj.time,
  };

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
}

export function deleteProject(project) {
  const { id } = project;

  const index = state.projects.findIndex(project => project.id === id);

  state.projects.splice(index, 1);

  if (state.activeProject.id === id) state.activeProject = {};
}

export function deleteTask(project, task) {
  const { id } = task;

  const index = project.tasks.findIndex(task => task.id === id);

  project.tasks.splice(index, 1);

  if (state.activeProject.id === 'today') setTodayTasks();
}
