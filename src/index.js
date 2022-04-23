'use strict'

// import * as helper from './scripts/helper.js'
import * as cfn from './scripts/cfn.js'

import * as rpf from './scripts/rpf.js'

import * as caca from './scripts/treemap_script.js'

import * as justin from './scripts/linechart_script'

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
  justin.load();
  rpf.load();
  cfn.load();
  caca.load();
})(d3)
