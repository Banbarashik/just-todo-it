import { store } from 'reefjs';
export { default as ProjectControls } from './components/ProjectControls';
export { default as AddProjectModalState } from './components/AddProjectModal';
export { default as EditProjectModal } from './components/EditProjectModal';
export { default as TaskControls } from './components/TaskControls';
export { default as AddTaskModalState } from './components/AddTaskModal';
export { default as EditTaskModal } from './components/EditTaskModal';

export const state = store({
  projects: [
    {
      id: '1',
      title: 'Test',
      description: 'A test project',
      dueDate: null,
      tasks: [
        {
          id: '11',
          title: 'Stronglifts',
          description: 'Complete a set of exercises',
          dueDate: null,
        },
      ],
    },
  ],
  activeProject: {},
});

export function setProjectAsActive(id) {
  state.activeProject = state.projects.find(project => project.id === id);
}

export function addProject(formData) {
  const { title, description, dueDate } = formData;

  const project = {
    id: Date.now().toString(),
    title,
    description,
    dueDate,
    tasks: [],
  };

  state.projects.push(project);
  state.activeProject = project;

  // Change ID in URL (doesn't invoke the 'hashchange' event)
  window.history.pushState(null, '', `#${project.id}`);
}

export function editProject(project, formData) {
  for (const prop in formData) {
    if (project[prop] === formData[prop]) continue;

    project[prop] = formData[prop];
  }
}

export function addTask(formData) {
  const { project: projectId, title, description, dueDate } = formData;

  const task = {
    id: Date.now().toString(),
    title,
    description,
    dueDate,
  };

  const project = state.projects.find(project => project.id === projectId);

  project.tasks.push(task);
}

export function editTask(task, project, formData) {
  for (const prop in formData) {
    if (task.hasOwnProperty(prop) && task[prop] !== formData[prop])
      task[prop] = formData[prop];

    if (prop === 'project' && project.id !== formData[prop]) {
      // Move the task to another project

      const index = project.tasks.findIndex(taskEl => taskEl.id === task.id);
      project.tasks.splice(index, 1);

      const newProject = state.projects.find(
        project => project.id === formData[prop]
      );

      newProject.tasks.push(task);

      continue;
    }
  }
}
