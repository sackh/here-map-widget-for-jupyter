/*
  Copyright (C) 2019 - 2021 HERE Europe B.V.
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
const object = require('./Object.js');
const widgets = require('@jupyter-widgets/base');
const _ = require('lodash');

export class OverlayModel extends object.ObjectModel {
  defaults() {
    return {
      //      ...super.defaults(),
      _view_name: 'OverlayView',
      _model_name: 'OverlayModel',

      boundingBox: null,
      bitmap: '',
      min: Infinity,
      max: Infinity,
      opacity: 1,
      visibility: true,
      volatility: false,
    };
  }
}

OverlayModel.serializers = _.extend({
  boundingBox: {
    deserialize: widgets.unpack_models
  },
}, widgets.DOMWidgetModel.serializers);

export class OverlayView extends object.ObjectView {
  create_obj() {
    return this.create_child_view(this.model.get('boundingBox'), {
      map_view: this.map_view,
    }).then((view) => {
      this.obj = new H.map.Overlay(
        view.obj,
        this.model.get('bitmap'), {
          min: this.model.get('min'),
          max: this.model.get('max'),
          opacity: this.model.get('opacity'),
          visibility: this.model.get('visibility'),
          volatility: this.model.get('volatility'),
        }
      );
    });

  }

  mapjs_events() {

  }

  model_events() {
    this.listenTo(
      this.model,
      'change:bitmap',
      function() {
        this.obj.setBitmap(this.model.get('bitmap'));
      },
      this
    );
  }
}