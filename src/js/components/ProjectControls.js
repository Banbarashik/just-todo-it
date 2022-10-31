import { store, component } from 'reefjs';
import * as model from '../model';
import Controls from './Controls';

class ProjectControls extends Controls {
  _parentElement = document.querySelector('.project-controls');

  constructor(state) {
    super();
    this._addHandlerOpenControls();
    this._addHandlerOpenEditModal();
    this._addHandlerDeleteItem();

    this.itemType = 'project';

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

    const projectItem = btn.closest('.project-item');
    const project = btn.closest('.project');
    const { id } = projectItem?.dataset || project?.dataset;
    this.project = model.state.projects.find(project => project.id === id);
    this.state.areControlsOpened = true;
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

  _addHandlerOpenControls() {
    document.addEventListener('click', this._openControls.bind(this));
  }

  _addHandlerDeleteItem() {
    this._parentElement.addEventListener('click', this._deleteItem.bind(this));
  }
}

const state = store(
  {
    areControlsOpened: false,
  },
  'project-controls'
);

export default new ProjectControls(state);
