import {
  select,
  csv,
  scaleLinear,
  extent,
  axisLeft,
  axisBottom
} from 'd3';
import { dropdownMenu } from './dropdownMenu';
import { scatterPlot } from './scatterPlot';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

let data;
let xColumn;
let yColumn;

const onXColumnClicked = column => {
  xColumn = column;
  render();
};


const render = () => {
  
  select('#x-menu')
    .call(dropdownMenu, {
      options: data.columns,
      onOptionClicked: onXColumnClicked,
      selectedOption: xColumn
    });

  
  svg.call(scatterPlot, {
    xValue: d => d[xColumn],
    xAxisLabel: xColumn,
    yValue: d => d['County'],
    circleRadius: 20,
    yAxisLabel: yColumn,
    margin: { top: 10, right: 80, bottom: 88, left: 100 },
    width,
    height,
    data
  });
};

csv('https://raw.githubusercontent.com/CBoton/asst3/master/CaTop10.csv')
  .then(loadedData => {
    data = loadedData;
    data.forEach(d => {
      d.TotalPopulation = +d.TotalPopulation;
      d.PercentWhite = +d.PercentWhite;
      d.PercentBlack = +d.PercentBlack;
      d.Men = +d.Men;
      d.Women = +d.Women;
      d.PercentHispanic = +d.PercentHispanic;
      d.PercentNative = +d.PercentNative;
      d.PercentAsian = +d.PercentAsian;
      d.PercentPacific = +d.PercentPacific;
      d.Over18 = +d.Over18;
      d.AverageIncome = +d.AverageIncome;
      d.PercentPoverty = +d.PercentPoverty;
      d.Professional = +d.Professional;
      d.Service = +d.Service;
      d.Office = +d.Office;
      d.Construction = +d.Construction;
      d.Production = +d.Production;
      d.Employed = +d.Employed;
      d.PercentUnemploymed = +d.PercentUnemploymed;
    });
    xColumn = data.columns[1];
    render();
  });