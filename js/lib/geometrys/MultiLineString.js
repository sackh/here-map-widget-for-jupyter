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
const geometry = require('./Geometry.js');
const _ = require('lodash');
const widgets = require('@jupyter-widgets/base');

export class MultiLineStringModel extends geometry.GeometryModel {
  defaults() {
    return {
      //      ...super.defaults(),
      _view_name: 'MultiLineStringView',
      _model_name: 'MultiLineStringModel',

      lines: [],
    };
  }
}

MultiLineStringModel.serializers = _.extend({
  lines: {
    deserialize: widgets.unpack_models
  },
}, widgets.DOMWidgetModel.serializers);

export class MultiLineStringView extends geometry.GeometryView {
  remove_layer_view(child_view) {
    this.obj.remove(child_view.obj);
    child_view.remove();
  }

  add_layer_model(child_model) {
    return this.create_child_view(child_model, {
      map_view: this
    }).then(view => {

      this.obj.push(view.obj);
      return view;
    });
  }
  create_obj() {
    this.layer_views = new widgets.ViewList(
      this.add_layer_model,
      this.remove_layer_view,
      this
    );

    this.create_child_view(this.model.get('lines')[0]).then((view) => {
      this.obj = new H.geo.MultiLineString([view.obj]);
    });
    return this.layer_views.update(this.model.get('lines'));
  }

  model_events() {
    this.listenTo(
      this.model,
      'change:lines',
      function() {
        return this.layer_views.update(this.model.get('lines'));
      },
      this
    );
  }
}