import { component } from '../../../node_modules/reefjs/src/reef';
import shiaLaBeoufPhoto from '../../img/shia_la_beouf.png';

class ShiaLaBeouf {
  _parentElement = document.querySelector('.shia-la-beouf');

  constructor() {
    component(this._parentElement, this._template);
  }

  _template() {
    return `<img src="${shiaLaBeoufPhoto}" />`;
  }
}

new ShiaLaBeouf();
