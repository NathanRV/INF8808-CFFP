'use strict'

// import * as helper from './scripts/helper.js'
import * as cfn from './scripts/cfn.js'

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

  // const xScale = d3.scaleBand().padding(0.15)
  // const xSubgroupScale = d3.scaleBand().padding([0.015])
  // const yScale = d3.scaleLinear()

  // const tip = d3Tip().attr('class', 'd3-tip').html(function (d) {    
  //   return 'not implemented yet'; //tooltip.getContents(d);
  // });

  // d3.select('.main-svg').call(tip)

  cfn.load();
})(d3)
