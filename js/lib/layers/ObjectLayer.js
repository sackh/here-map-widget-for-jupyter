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
const layer = require('./Layer.js');
const widgets = require('@jupyter-widgets/base');
const _ = require('lodash');

export class ObjectLayerModel extends layer.LayerModel {
  defaults() {
    return {
      //      ...super.defaults(),
      _view_name: 'ObjectLayerView',
      _model_name: 'ObjectLayerModel',

      provider: null,
      tile_size: 256,
      tile_cache_size: 32,
      data_cache_size: 512,
      pixel_ratio: 0
    };
  }
}

ObjectLayerModel.serializers = _.extend({
  provider: {
    deserialize: widgets.unpack_models
  },
}, widgets.DOMWidgetModel.serializers);

export class ObjectLayerView extends layer.LayerView {
  create_obj() {
    return this.create_child_view(this.model.get('provider'), {
      map_view: this.map_view
    }).then((view) => {
      this.provider = view.obj;
      var tileSize = this.model.get('tile_size');
      var tileCacheSize = this.model.get('tile_cache_size');
      var dataCacheSize = this.model.get('data_cache_size');
      var pixel_ratio = this.model.get('pixel_ratio');
      var pixelRatio = pixel_ratio === 0 ? window.devicePixelRatio : pixel_ratio;
      var options = {
        tileSize: tileSize,
        tileCacheSize: tileCacheSize,
        dataCacheSize: dataCacheSize,
        pixelRatio: pixelRatio
      };
      this.obj = new H.map.layer.ObjectLayer(this.provider, options);
    });

  }

  model_events() {}
  mapjs_events() {}
}