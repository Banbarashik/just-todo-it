import { store, component } from 'reefjs';
import * as model from '../model';

const state = store(
  {
    areProjectControlsOpened: false,
    targetProjectId: null,
  },
  'project-controls'
);

function _template() {
  if (!state.areProjectControlsOpened) return '';

  return `
    <button class="project__btn--edit">Edit project</button>
    <button class="project__btn--delete">Delete project</button>
  `;
}

component('.project-controls', _template, { stores: ['project-controls'] });

// EVENT LISTENERS

// OPEN PROJECT CONTROLS
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.btn--project-controls');

  if (!btn) {
    state.areProjectControlsOpened = false;
    return;
  }

  const projectItem = btn.closest('.project-item');
  const project = btn.closest('.project');

  const id = projectItem
    ? projectItem.dataset.id
    : project
    ? project.dataset.id
    : null;

  state.areProjectControlsOpened = true;
  state.targetProjectId = id;
});

// DELETE A PROJECT
document.addEventListener('click', function (e) {
  const btnDeleteProject = e.target.closest('.project__btn--delete');
  if (!btnDeleteProject) return;

  const index = model.state.projects.findIndex(
    projet => projet.id === state.targetProjectId
  );

  // if the project is active - reset the active project
  if (model.state.activeProject.id === state.targetProjectId)
    model.state.activeProject = {};

  model.state.projects.splice(index, 1);
});

// OPEN THE 'EDIT A PROJECT' MODAL
document.addEventListener('click', function (e) {
  const btnEditModal = e.target.closest('.project__btn--edit');
  if (!btnEditModal) return;

  model.EditProjectModalState.isModalOpened = true;
});

export default state;
