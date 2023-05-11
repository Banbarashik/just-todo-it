import { store, component } from '../../../node_modules/reefjs/src/reef';
import * as model from '../model';
import Controls from './Controls';

class ProjectControls extends Controls {
  _parentElement = document.querySelector('.dropdown--project-controls');
  _itemType = 'project';

  constructor(state) {
    super();
    this._addHandlerOpenControls(this._openControls.bind(this));
    this._addHandlerOpenEditModal(this._openEditModal);
    this._addHandlerDeleteItem(this._deleteItem.bind(this));

    this.state = state;

    component(this._parentElement, this._template.bind(this));
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
    this.state.project = model
      .getProjectsWithOwnTasks()
      .find(project => project.id === id);

    const { left: x, bottom: y } = btn.getBoundingClientRect();
    this.state.elCoords = { x, y };
  }

  _openEditModal(e) {
    super._openEditModal(e, model.EditProjectModal.openModal);
  }

  _deleteItem(e) {
    super._deleteItem({
      event: e,
      handler: model.deleteProject,
      projectId: this.state.project.id,
    });
  }
}

const state = store({
  areControlsOpened: false,
  project: {},
  elCoords: { x: null, y: null },
});

export default new ProjectControls(state);
