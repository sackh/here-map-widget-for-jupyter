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

export class CircleModel extends object.ObjectModel {
  defaults() {
    return {
      //      ...super.defaults(),
      _view_name: 'CircleView',
      _model_name: 'CircleModel',

      center: null,
      radius: 100,
      style: {},
      draggable: false,
      extrusion: 0.0,
      elevation: 0.0,
    };
  }
}

CircleModel.serializers = _.extend({
  center: {
    deserialize: widgets.unpack_models
  },
}, widgets.DOMWidgetModel.serializers);

export class CircleView extends object.ObjectView {
  create_obj() {
    return this.create_child_view(this.model.get('center')).then((view) => {
      var radius = this.model.get('radius');
      this.obj = new H.map.Circle(view.obj, radius, {
        style: this.model.get('style'),
        extrusion: this.model.get('extrusion'),
        elevation: this.model.get('elevation')
      });
      this.obj.draggable = this.model.get('draggable');
    });

  }

  mapjs_events() {
    var map = this.map_view.obj;
    this.obj.addEventListener('dragstart', function(evnt) {
      var pointer = evnt.currentPointer,
        object = evnt.target,
        screenPositon = map.geoToScreen(object.getCenter()),
        offset = new H.math.Point(pointer.viewportX - screenPositon.x, pointer.viewportY - screenPositon.y);
      // store difference between starting mouse position and circle's center
      object.setData({
        offset: offset
      });
      evnt.stopPropagation();
    });

    this.obj.addEventListener('drag', function(evnt) {
      var pointer = evnt.currentPointer,
        object = evnt.target,
        offset = object.getData()['offset'];
      object.setCenter(map.screenToGeo(pointer.viewportX - offset.x, pointer.viewportY - offset.y));
      evnt.stopPropagation();
    });

  }

  model_events() {
    this.listenTo(
      this.model,
      'change:radius',
      function() {
        this.obj.setRadius(this.model.get('radius'));
      },
      this
    );

    this.listenTo(
      this.model,
      'change:center',
      function() {
        this.create_child_view(this.model.get('center')).then((view) => {
        this.obj.setCenter(view.obj);
        });
      },
      this
    );
  }
}