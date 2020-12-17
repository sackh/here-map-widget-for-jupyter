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
const object = require('./Object.js');
const widgets = require('@jupyter-widgets/base');
const _ = require('lodash');

export class PolylineModel extends object.ObjectModel {
  defaults() {
    return {
      //      ...super.defaults(),
      _view_name: 'PolylineView',
      _model_name: 'PolylineModel',

      object: null,
      style: {},
      draggable: false,
    };
  }
}

PolylineModel.serializers = _.extend({
  // ...widgets.DOMWidgetModel.serializers,
  object: {
    deserialize: widgets.unpack_models
  },
}, widgets.DOMWidgetModel.serializers);

export class PolylineView extends object.ObjectView {
  create_obj() {
    return this.create_child_view(this.model.get('object')).then((view) => {
      this.obj = new H.map.Polyline(view.obj, {
        style: this.model.get('style')
      });
      this.obj.draggable = this.model.get('draggable');
    });

  }
  mapjs_events() {
    var map = this.map_view.obj;
    this.obj.addEventListener('dragstart', function(evnt) {
      var pointer = evnt.currentPointer,
        object = evnt.target;

      // store the starting geo position
      object.setData({
        startCoord: map.screenToGeo(pointer.viewportX, pointer.viewportY)
      });
      evnt.stopPropagation();
    });

    this.obj.addEventListener('drag', function(evnt) {
      var pointer = evnt.currentPointer,
        object = evnt.target,
        startCoord = object.getData()['startCoord'],
        newCoord = map.screenToGeo(pointer.viewportX, pointer.viewportY),
        outOfMapView = false;

      if (!newCoord.equals(startCoord)) {
        var currentLineString = object.getGeometry(),
          newLineString = new H.geo.LineString();

        // create new LineString with updated coordinates
        currentLineString.eachLatLngAlt(function(lat, lng, alt) {
          var diffLat = (lat - startCoord.lat),
            diffLng = (lng - startCoord.lng),
            newLat = newCoord.lat + diffLat,
            newLng = newCoord.lng + diffLng;

          // prevent dragging to latitude over 90 or -90 degrees
          if (newLat >= 90 || newLat <= -90) {
            outOfMapView = true;
            return;
          }

          newLineString.pushLatLngAlt(newLat, newLng, 0);
        });

        if (!outOfMapView) {
          object.setGeometry(newLineString);
          object.setData({
            startCoord: newCoord
          });
        }
      }
      evnt.stopPropagation();
    });

  }
  model_events() {
    //
  }
}