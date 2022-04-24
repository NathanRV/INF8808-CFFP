'use strict'

import * as cfn from './scripts/cfn.js'

import * as rpf from './scripts/rpf.js'

import * as treemap from './scripts/treemap.js'

import * as linechart from './scripts/linechart.js'

import * as map from './scripts/map.js'

import * as text from './scripts/text.js'

/**
 * @file This file is the entry-point
 * @author Nathan Ramsay-Vejlens
 * @version v1.0.0
 */

(function (d3) {
  const margin = { top: 80, right: 0, bottom: 80, left: 55 };

  text.load();
  map.load();
  linechart.load();
  rpf.load();
  cfn.load();
  treemap.load();
})(d3)
