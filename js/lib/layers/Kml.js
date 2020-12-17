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
const layer = require('./Layer.js');
const widgets = require('@jupyter-widgets/base');
const _ = require('lodash');

export class KmlLayerModel extends layer.LayerModel {
  defaults() {
    return {
      //      ...super.defaults(),
      _view_name: 'KmlLayerView',
      _model_name: 'KmlLayerModel',

      url: '',

    };
  }
}


export class KmlLayerView extends layer.LayerView {
  create_obj() {
    var reader = new H.data.kml.Reader(this.model.get('url'));
    this.obj = reader.getLayer();
    reader.parse();

  }

  model_events() {
    //
  }
  mapjs_events() {
    //
  }
}