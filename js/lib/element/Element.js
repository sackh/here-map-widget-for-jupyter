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
const widgets = require('@jupyter-widgets/base');
const _ = require('lodash');
import H from '@here/maps-api-for-javascript/bin/mapsjs.bundle'

export class ElementModel extends widgets.WidgetModel {
  defaults() {
    return {
      //      ...super.defaults(),
      _view_name: 'ElementView',
      _model_name: 'ElementModel',
      _view_module: 'map-widget-for-jupyter',
      _model_module: 'map-widget-for-jupyter',
    };
  }
}

ElementModel.serializers = _.extend(widgets.WidgetModel.serializers);

export class ElementView extends widgets.WidgetView {
  initialize(parameters) {
    super.initialize(parameters);
    this.map_view = this.options.map_view;
  }

  render() {
    return Promise.resolve(this.create_obj()).then(() => {
      this.model_events();
    });
  }
}