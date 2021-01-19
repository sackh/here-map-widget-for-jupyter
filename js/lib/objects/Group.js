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

export class GroupModel extends object.ObjectModel {
  defaults() {
    return {
      //      ...super.defaults(),
      _view_name: 'GroupView',
      _model_name: 'GroupModel',

      volatility: false,
      objects: [],
    };
  }
}

GroupModel.serializers = _.extend({
  objects: {
    deserialize: widgets.unpack_models
  },
}, widgets.DOMWidgetModel.serializers);

export class GroupView extends object.ObjectView {
  remove_object_view(child_view) {
    if (this.hasOwnProperty('obj')) {
      this.obj.removeObject(child_view.obj);
      child_view.remove();
    }
  }

  add_object_model(child_model) {
    console.log("Object GROUP " + child_model + " " + child_model.state_change);
    return this.create_child_view(child_model, {
      map_view: this.map_view
    }).then(view => {
      if (this.hasOwnProperty('obj')) {
        this.obj.addObject(view.obj);
      } else {
        this.objArr.push(view.obj);
      }
      // Trigger the displayed event of the child view.
      this.displayed.then(() => {
        view.trigger('displayed', this);
      });

      return view;
    });
  }

  create_obj() {
    this.objArr = [];
    this.object_views = new widgets.ViewList(
      this.add_object_model,
      this.remove_object_view,
      this
    );

    return this.object_views.update(this.model.get('objects')).then(() => {
      var options = {
        volatility: this.model.get('volatility'),
        objects: this.objArr
      };
      this.obj = new H.map.Group(options);

    });

  }
  mapjs_events() {
    //

  }
  model_events() {
    this.listenTo(
      this.model,
      'change:objects',
      function() {
        this.object_views.update(this.model.get('objects'));
      },
      this
    );
  }
}