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
const service = require('./Service.js');
const widgets = require('@jupyter-widgets/base');
const _ = require('lodash');

export class DefaultLayersModel extends service.ServiceModel {
  defaults() {
    return {
      _view_name: 'DefaultLayersView',
      _model_name: 'DefaultLayersModel',

      layer_name: 'vector.normal.map',
      tile_size: 512,
      ppi: undefined,

    };
  }
}



export class DefaultLayersView extends service.ServiceView {
  initialize(parameters) {
    super.initialize(parameters);
    this.map_view = this.options.parent;

  }
  create_obj() {
    var ppi = this.model.get('ppi') === null ? undefined : this.model.get('ppi');
    var platform = new H.service.Platform({
      apikey: this.map_view.model.get('api_key')
    });
    var defaultLayers = platform.createDefaultLayers({
      tileSize: this.model.get('tile_size'),
      ppi: ppi
    });
    this.obj = _.get(defaultLayers, this.model.get('layer_name'));
  }

  model_events() {}

  mapjs_events() {
    //
  }

}