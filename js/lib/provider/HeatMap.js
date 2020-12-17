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
const provider = require('./Provider.js');
const widgets = require('@jupyter-widgets/base');

export class HeatMapModel extends provider.ProviderModel {
  defaults() {
    return {
      //      ...super.defaults(),
      _view_name: 'HeatMapView',
      _model_name: 'HeatMapModel',

      colors: {},
      interpolate: false,
      opacity: 1.0,
      assume_values: false,
      data: [],
      hardReload: false,
      clear_flag: 1,
    };
  }
}


export class HeatMapView extends provider.ProviderView {
  create_obj() {
    if (Object.keys(this.model.get('colors')).length !== 0) {
      this.colors = new H.data.heatmap.Colors(this.model.get('colors'), this.model.get('interpolate'));
      this.obj = new H.data.heatmap.Provider({
        colors: this.colors,
        opacity: this.model.get('opacity'),
        // Paint assumed values in regions where no data is available
        assumeValues: this.model.get('assume_values')
      });
    } else {
      this.obj = new H.data.heatmap.Provider({
        opacity: this.model.get('opacity'),
        // Paint assumed values in regions where no data is available
        assumeValues: this.model.get('assume_values')
      });
    }
    if (this.model.get('data').length != 0) {
      this.obj.addData(this.model.get('data'), this.model.get('hardReload'));
      this.model.set('data', []);
    }
  }

  model_events() {
    this.listenTo(
      this.model,
      'change:data',
      function() {
        if (Object.keys(this.model.get('data')).length !== 0) {
          this.obj.addData(this.model.get('data'), this.model.get('hardReload'));
          this.model.set('data', []);
        }
      },
      this
    );

    this.listenTo(
      this.model,
      'change:clear_flag',
      function() {
        this.obj.clear();
      },
      this
    );

    this.listenTo(
      this.model,
      'change:opacity',
      function() {
        this.obj.setOpacity(this.model.get('opacity'));
      },
      this
    );
  }

  mapjs_events() {

  }
}