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
const provider = require('./Provider.js');
const widgets = require('@jupyter-widgets/base');

export class OMVModel extends provider.ProviderModel {
  defaults() {
    return {
      _view_name: 'OMVView',
      _model_name: 'OMVModel',

      path: '',
      platform: null,
      style: null,
    };
  }
}

OMVModel.serializers = _.extend({
  platform: {
    deserialize: widgets.unpack_models
  },
  style: {
    deserialize: widgets.unpack_models
  },
}, widgets.DOMWidgetModel.serializers);


export class OMVView extends provider.ProviderView {
  create_obj() {
    const pltform = this.model.get('platform');
    const style = this.model.get('style');

    const style_promise = style !== null ? this.create_child_view(style) : Promise.resolve(null);
    const pltform_promise = pltform !== null ? this.create_child_view(pltform) : Promise.resolve(null);

    return Promise.all([pltform_promise, style_promise]).then(result => {
      const pltform_view = result[0];
      const style_view = result[1];
      const platform = pltform_view !== null ? pltform_view.obj : null;
      const st = style_view !== null ? style_view.obj : null;
      var omvService = platform.getOMVService({
        path: this.model.get('path')
      });
      this.obj = new H.service.omv.Provider(omvService, st);
    });
  }

  model_events() {}

  mapjs_events() {}

}