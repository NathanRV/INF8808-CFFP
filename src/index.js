'use strict'

// import * as helper from './scripts/helper.js'
import * as cfn from './scripts/cfn.js'

import * as stackedBarCharts from './scripts/stacked-bar-charts.js'

import d3 from 'd3';

/**
 * @file This file is the entry-point
 * @author Nathan Ramsay-Vejlens
 * @version v1.0.0
 */

(function (d3) {
  const margin = { top: 80, right: 0, bottom: 80, left: 55 };

  let bounds;
  let svgSize;
  let graphSize;

  // cfn.load();
  stackedBarCharts.load();
})(d3)
