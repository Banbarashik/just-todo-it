import { store, component } from 'reefjs';
import * as model from '../model';
import Controls from './Controls';

class ProjectControls extends Controls {
  _parentElement = document.querySelector('.project-controls');
  _itemType = 'project';

  constructor(state) {
    super();
    this._addHandlerOpenControls();
    this._addHandlerOpenEditModal();
    this._addHandlerDeleteItem();

    this.project = {};

    this.state = state;

    component(this._parentElement, this._template.bind(this), {
      stores: ['project-controls'],
    });
  }

  _openControls(e) {
    const btn = e.target.closest('.btn--project-controls');

    if (!btn) {
      this.state.areControlsOpened = false;
      return;
    }

    this.state.areControlsOpened = true;

    const projectItem = btn.closest('.project-item');
    const project = btn.closest('.project');
    const { id } = projectItem?.dataset || project?.dataset;
    this.project = model.state.projects.find(project => project.id === id);

    const rect = btn.getBoundingClientRect();
    this.state.y = rect.bottom;
    this.state.x = rect.left;
  }

  _openEditModal(e) {
    const btn = e.target.closest('.btn--edit-item');
    if (btn) model.EditProjectModal.openModal();
  }

  _deleteItem(e) {
    const btn = e.target.closest('.btn--delete-item');
    if (!btn) return;

    const index = model.state.projects.findIndex(
      project => project.id === this.project.id
    );

    model.state.projects.splice(index, 1);

    if (model.state.activeProject.id === this.project.id)
      model.state.activeProject = {};
  }
}

const state = store(
  {
    areControlsOpened: false,
    x: null,
    y: null,
  },
  'project-controls'
);

export default new ProjectControls(state);
