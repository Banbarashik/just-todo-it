import { store } from 'reefjs';
export { default as AddProjectModalState } from './components/AddProjectModal';
export { default as EditProjectModalState } from './components/EditProjectModal';
export { default as ProjectControlsState } from './components/ProjectControls';

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
  for (let prop in formData) {
    if (formData[prop] === project[prop]) continue;

    project[prop] = formData[prop];
  }
}

export function setProjectAsActive(id) {
  state.activeProject = state.projects.find(project => project.id === id);
}
