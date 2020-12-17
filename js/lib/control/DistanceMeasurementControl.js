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


export class DistanceMeasurementModel extends control.ControlModel {
  defaults() {
    return {
      //      ...super.defaults(),
      _view_name: 'DistanceMeasurementView',
      _model_name: 'DistanceMeasurementModel',

      name: "DistanceMeasurement",
      alignment: "RIGHT_BOTTOM",
      start_icon: null,
      stopover_icon: null,
      end_icon: null,
      split_icon: null,
      line_style: {
        'strokeColor': 'rgba(18, 65, 145, .8)',
        'lineWidth': 6
      },
    };
  }
}

DistanceMeasurementModel.serializers = _.extend({
  start_icon: {
    deserialize: widgets.unpack_models
  },
  stopover_icon: {
    deserialize: widgets.unpack_models
  },
  end_icon: {
    deserialize: widgets.unpack_models
  },
  split_icon: {
    deserialize: widgets.unpack_models
  },
}, widgets.DOMWidgetModel.serializers);

export class DistanceMeasurementView extends control.ControlView {
  create_obj() {
    const start_icon = this.model.get('start_icon');
    const stopover_icon = this.model.get('stopover_icon');
    const end_icon = this.model.get('end_icon');
    const split_icon = this.model.get('split_icon');

    const start_icon_promise = start_icon !== null ? this.create_child_view(start_icon) : Promise.resolve(null);
    const stopover_icon_promise = stopover_icon !== null ? this.create_child_view(stopover_icon) : Promise.resolve(null);
    const end_icon_promise = end_icon !== null ? this.create_child_view(end_icon) : Promise.resolve(null);
    const split_icon_promise = split_icon !== null ? this.create_child_view(split_icon) : Promise.resolve(null);

    return Promise.all([start_icon_promise, stopover_icon_promise, end_icon_promise, split_icon_promise]).then(result => {
      const start_icon_view = result[0],
        stopover_icon_view = result[1],
        end_icon_view = result[2],
        split_icon_view = result[3];
      const start_icon_obj = start_icon_view !== null ? start_icon_view.obj : null;
      const stopover_icon_obj = stopover_icon_view !== null ? stopover_icon_view.obj : null;
      const end_icon_obj = end_icon_view !== null ? end_icon_view.obj : null;
      const split_icon_obj = split_icon_view != null ? split_icon_view.obj : null;
      var options = {
        alignment: _.get(H.ui.LayoutAlignment, this.model.get('alignment'))
      };
      if (start_icon_obj) {
        options['startIcon'] = start_icon_obj;
      }
      if (stopover_icon_obj) {
        options['stopoverIcon'] = stopover_icon_obj;
      }
      if (end_icon_obj) {
        options['endIcon'] = end_icon_obj;
      }
      if (split_icon_obj) {
        options['splitIcon'] = split_icon_obj;
      }

      this.obj = new H.ui.DistanceMeasurement(options);

    });

  }

  model_events() {
    //
  }
}