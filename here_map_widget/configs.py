# Copyright (C) 2019 - 2021 HERE Europe B.V.
# SPDX-License-Identifier: MIT
#
# Permission is hereby granted, free of charge, to any person obtaining
# a copy of this software and associated documentation files (the
# 'Software'), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, subject to
# the following conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
# IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
# CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
# TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
# SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

"""
This module defines all the constants, which will be used as configuration parameters
for HERE Location Services or basemaps.
"""

from argparse import Namespace


class DefaultLayerNames:
    """This class defines pre-configured set of HERE layers for convenient use with the map."""

    vector = Namespace(
        normal=Namespace(
            map="vector.normal.map",
            truck="vector.normal.truck",
            traffic="vector.normal.traffic",
            trafficincidents="vector.normal.trafficincidents",
        )
    )

    raster = Namespace(
        normal=Namespace(
            map="raster.normal.map",
            mapnight="raster.normal.mapnight",
            xbase="raster.normal.xbase",
            xbasenight="raster.normal.xbasenight",
            base="raster.normal.base",
            basenight="raster.normal.basenight",
            trafficincidents="raster.normal.trafficincidents",
            transit="raster.normal.transit",
            labels="raster.normal.labels",
        ),
        satellite=Namespace(
            map="raster.satellite.map",
            xbase="raster.satellite.xbase",
            base="raster.satellite.base",
            labels="raster.satellite.labels",
        ),
        terrain=Namespace(
            map="raster.terrain.map",
            xbase="raster.terrain.xbase",
            base="raster.terrain.base",
            labels="raster.terrain.labels",
        ),
    )


class ServiceNames:
    """This class implements configurations for Here Location Services."""

    routing = "routing"
    omv = "omv"
    geocoding = "geocoding"
    maptile = "maptile"
    traffic = "traffic"


class URL:
    """This is base class for all urls of the services."""

    scheme = "scheme"
    host = "host"
    path = "path"


class OMVUrl(URL):
    """This class implements configurations OMV service url."""

    pass


class MapTileUrl(URL):
    """This class implements configurations for MapTile service url."""

    pass
