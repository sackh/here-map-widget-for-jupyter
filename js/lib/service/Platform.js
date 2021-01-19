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
const service = require('./Service.js');
const widgets = require('@jupyter-widgets/base');

export class PlatformModel extends service.ServiceModel {
  defaults() {
    return {
      _view_name: 'PlatformView',
      _model_name: 'PlatformModel',

      api_key: null,
      services_config: null,
    };
  }
}


export class PlatformView extends service.ServiceView {
  create_obj() {
    var services_config = this.model.get('services_config');
    const config = {};
    const getoptions = {
      apikey: this.model.get('api_key')
    };
    if (services_config) {
      Object.keys(services_config).forEach(function(key) {
        config[key] = {
          baseUrl: new H.service.Url(services_config[key]['scheme'],
            services_config[key]['host'],
            services_config[key]['path'],
            getoptions
          )
        };
      });
    }
    this.obj = new H.service.Platform({
      apikey: this.model.get('api_key'),
      servicesConfig: config
    });
  }

  model_events() {}

  mapjs_events() {}

}