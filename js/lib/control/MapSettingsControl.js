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


export class MapSettingsControlModel extends control.ControlModel {
  defaults() {
    return {
      //      ...super.defaults(),
      _view_name: 'MapSettingsControlView',
      _model_name: 'MapSettingsControlModel',

      name: "mapsettings",
      basemaps: [],
      layers: [],
      alignment: "TOP_RIGHT",
    };
  }
}

MapSettingsControlModel.serializers = _.extend({
  layers: {
    deserialize: widgets.unpack_models
  },
}, widgets.DOMWidgetModel.serializers);

export class MapSettingsControlView extends control.ControlView {

  remove_layer_view(child_view) {
    child_view.remove();
  }

  create_obj() {
    var basemaps = this.model.get('basemaps');
    var platform = new H.service.Platform({
      apikey: this.map_view.model.get('api_key')
    });
    var pixelRatio = window.devicePixelRatio || 1;
    var defaultLayers = platform.createDefaultLayers({
      tileSize: pixelRatio === 1 ? 256 : 512,
      ppi: pixelRatio === 1 ? undefined : 320
    });
    var layers_map = {
      vector: {
        normal: {
          map: defaultLayers.vector.normal.map,
          truck: defaultLayers.vector.normal.truck,
          traffic: defaultLayers.vector.normal.traffic,
          trafficincidents: defaultLayers.vector.normal.trafficincidents,
        }
      },
      raster: {
        normal: {
          map: defaultLayers.raster.normal.map,
          mapnight: defaultLayers.raster.normal.mapnight,
          xbase: defaultLayers.raster.normal.xbase,
          xbasenight: defaultLayers.raster.normal.xbasenight,
          base: defaultLayers.raster.normal.base,
          basenight: defaultLayers.raster.normal.basenight,
          trafficincidents: defaultLayers.raster.normal.trafficincidents,
          transit: defaultLayers.raster.normal.transit,
          labels: defaultLayers.raster.normal.labels,
        },
        satellite: {
          map: defaultLayers.raster.satellite.map,
          xbase: defaultLayers.raster.satellite.xbase,
          base: defaultLayers.raster.satellite.base,
          labels: defaultLayers.raster.satellite.labels,
        },
        terrain: {
          map: defaultLayers.raster.terrain.map,
          xbase: defaultLayers.raster.terrain.xbase,
          base: defaultLayers.raster.terrain.base,
          labels: defaultLayers.raster.terrain.labels,
        }
      }
    };
    this.BaseLayers = [];
    basemaps.forEach((bname, index) => {
      var map_arr = bname.split('.');
      var map_type = layers_map[map_arr[0]][map_arr[1]][map_arr[2]];
      var bentry = new H.ui.MapSettingsControl();
      bentry.label = bname;
      bentry.layer = map_type;
      this.BaseLayers.push(bentry);
    });
    this.viewNames = [];
    this.viewArr = [];
    this.layer_views = new widgets.ViewList(
      this.add_layer_model,
      this.remove_layer_view,
      this
    );

    return this.layer_views.update(this.model.get('layers')).then(() => {
      var LayersArr = [];
      // hack reversing the viewArr as it is not in sync with ViewNames
      this.viewArr.reverse();
      this.viewNames.forEach((lname, index) => {
        var lobj = this.viewArr[index];
        var entry = new H.ui.MapSettingsControl();
        entry.label = lname;
        entry.layer = lobj;
        LayersArr.push(entry);
      });
      var options = {
        alignment: _.get(H.ui.LayoutAlignment, this.model.get('alignment')),
        baseLayers: this.BaseLayers,
        layers: LayersArr
      };
      this.obj = new H.ui.MapSettingsControl(options);
    });

  }

  add_layer_model(child_model) {
    this.viewNames.push(child_model['label']);
    return this.create_child_view(child_model['layer'], {
      map_view: this.map_view
    }).then(view => {
      this.viewArr.push(view.obj);
      return view;
    });
  }

  model_events() {
    //
  }
}