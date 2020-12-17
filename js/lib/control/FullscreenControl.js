/*
  Copyright (C) 2019 - 2020 HERE Europe B.V.
  SPDX-License-Identifier: MIT

  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  'Software'), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
const control = require('./Control.js');
const widgets = require('@jupyter-widgets/base');
const _ = require('lodash');
const PMessaging = require('@phosphor/messaging');
const PWidgets = require('@phosphor/widgets');

class FullscreenControl extends H.ui.Control {
  constructor(map_view) {
    super();
    this.map_view = map_view;
    this.options = {
      position: 'topleft',
      title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
      }
    }
    var fullscreenchange;

    if ('onfullscreenchange' in document) {
      fullscreenchange = 'fullscreenchange';
    } else if ('onmozfullscreenchange' in document) {
      fullscreenchange = 'mozfullscreenchange';
    } else if ('onwebkitfullscreenchange' in document) {
      fullscreenchange = 'webkitfullscreenchange';
    } else if ('onmsfullscreenchange' in document) {
      fullscreenchange = 'MSFullscreenChange';
    }

    if (fullscreenchange) {
      var onFullscreenChange = this.bind(this, this._onFullscreenChange);

      document.addEventListener(fullscreenchange, onFullscreenChange, false);
    }
  }

  renderInternal(el, doc) {
    this.map = el;
    this.div = doc.createElement('div');
    this.div.className = 'H_ctl H_el H_grp';

    this.container = doc.createElement('div');
    this.container.className = 'mapjs-control-fullscreen';
    this.div.appendChild(this.container);

    this.link = doc.createElement('a');
    this.link.className = 'mapjs-control-fullscreen-button';
    this.link.href = '#';

    this.container.appendChild(this.link);
    el.appendChild(this.div);
    super.renderInternal(el, doc);
    this.link.addEventListener("click", this.bind(this, this._click), false);
    this._toggleTitle();
  }

  bind(scope, fn) {
    return function() {
      fn.apply(scope, arguments);
    };
  }

  _click() {
    this.toggleFullscreen(this.options);
  }

  _toggleTitle() {
    this.link.title = this.options.title[this.isFullscreen()];
  }

  isFullscreen() {
    return this._isFullscreen || false;
  }

  toggleFullscreen(options) {
    var container = this.map_view.map_container;
    if (this.isFullscreen()) {
      if (options && options.pseudoFullscreen) {
        this._disablePseudoFullscreen(container);
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else {
        this._disablePseudoFullscreen(container);
      }
    } else {
      if (options && options.pseudoFullscreen) {
        this._enablePseudoFullscreen(container);
      } else if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      } else {
        this._enablePseudoFullscreen(container);
      }
    }

  }

  _enablePseudoFullscreen(container) {
    container.classList.add('mapjs-pseudo-fullscreen');
    this._setFullscreen(true);
    //        this.fire('fullscreenchange');
  }

  _disablePseudoFullscreen(container) {
    container.classList.remove('mapjs-pseudo-fullscreen');
    this._setFullscreen(false);
    //        this.fire('fullscreenchange');
  }

  _setFullscreen(fullscreen) {
    this._isFullscreen = fullscreen;
    var container = this.map_view.map_container;
    if (fullscreen) {
      container.classList.add('mapjs-fullscreen-on');
    } else {
      container.classList.remove('mapjs-fullscreen-on');
    }
    //        this.invalidateSize();
  }

  _onFullscreenChange(e) {
    //resize view port
    this.map_view.obj.getViewPort().resize();
    var fullscreenElement =
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement;

    if (fullscreenElement === this.map_view.map_container && !this._isFullscreen) {
      this._setFullscreen(true);
      //            this.fire('fullscreenchange');
    } else if (fullscreenElement !== this.map_view.map_container && this._isFullscreen) {
      this._setFullscreen(false);
      //            this.fire('fullscreenchange');
    }
    this._toggleTitle();
  }
}

export class FullscreenControlModel extends control.ControlModel {
  defaults() {
    return {
      //      ...super.defaults(),
      _view_name: 'FullscreenControlView',
      _model_name: 'FullscreenControlModel',

      name: "FullscreenControl",
      alignment: "TOP_LEFT",
    }
  }
}

export class FullscreenControlView extends control.ControlView {

  create_obj() {
    this.obj = new FullscreenControl(this.map_view);
    this.obj.setAlignment(_.get(H.ui.LayoutAlignment, this.model.get('alignment')));
  }

  model_events() {}
}