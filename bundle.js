(function (d3) {
  'use strict';

  const dropdownMenu = (selection, props) => {
    const {
      options,
      onOptionClicked,
      selectedOption
    } = props;
    
    let select = selection.selectAll('select').data([null]);
    select = select.enter().append('select')
      .merge(select)
        .on('change', function() {
          onOptionClicked(this.value);
        });
    
    const option = select.selectAll('option').data(options);
    option.enter().append('option')
      .merge(option)
        .attr('value', d => d)
        .property('selected', d => d === selectedOption)
        .text(d => d);
  };

  const scatterPlot = (selection, props) => {
    const {
      xValue,
      xAxisLabel,
      yValue,
      circleRadius,
      yAxisLabel,
      margin,
      width,
      height,
      data
    } = props;
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth])
      .nice();
    
    const yScale = d3.scalePoint()
      .domain(data.map(yValue))
      .range([0, innerHeight])
      .padding(0.3);
    
    const g = selection.selectAll('.container').data([null]);
    const gEnter = g
      .enter().append('g')
        .attr('class', 'container');
    gEnter
      .merge(g)
        .attr('transform',
          `translate(${margin.left},${margin.top})`
        );
    
    const xAxis = d3.axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickPadding(15);
    
    const yAxis = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickPadding(10);
    
    const yAxisG = g.select('.y-axis');
    const yAxisGEnter = gEnter
      .append('g')
        .attr('class', 'y-axis');
    yAxisG
      .merge(yAxisGEnter)
        .call(yAxis)
        .selectAll('.domain').remove();
    
    const yAxisLabelText = yAxisGEnter
      .append('text')
        .attr('class', 'axis-label')
        .attr('y', -93)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
      .merge(yAxisG.select('.axis-label'))
        .attr('x', -innerHeight / 2)
        .text(yAxisLabel);
    
    
    const xAxisG = g.select('.x-axis');
    const xAxisGEnter = gEnter
      .append('g')
        .attr('class', 'x-axis');
    xAxisG
      .merge(xAxisGEnter)
        .attr('transform', `translate(0,${innerHeight})`)
        .call(xAxis)
        .selectAll('.domain').remove();
    
    const xAxisLabelText = xAxisGEnter
      .append('text')
        .attr('class', 'axis-label')
        .attr('y', 75)
        .attr('fill', 'black')
      .merge(xAxisG.select('.axis-label'))
        .attr('x', innerWidth / 2)
        .text(xAxisLabel);

    
    const circles = g.merge(gEnter)
      .selectAll('circle').data(data);
    circles
      .enter().append('circle')
        .attr('cx', innerWidth / 2)
        .attr('cy', innerHeight / 2)
        .attr('r', 10)
      .merge(circles)
      .transition().duration(2000)
      .delay((d, i) => i * 10)
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', circleRadius);
  };

  const svg = d3.select('svg');

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
    
    d3.select('#x-menu')
      .call(dropdownMenu, {
        options: data.columns.slice(1),
        onOptionClicked: onXColumnClicked,
        selectedOption: xColumn
      });

    
    svg.call(scatterPlot, {
      xValue: d => d[xColumn],
      xAxisLabel: xColumn,
      yValue: d => d['County'],
      circleRadius: 10,
      yAxisLabel: 'County',
      margin: { top: 10, right: 120, bottom: 88, left: 110 },
      width,
      height,
      data
    });
  };

  d3.csv('https://raw.githubusercontent.com/CBoton/asst3/master/CaFinal.csv')
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
        d.PrivateWork = +d.PrivateWork;
        d.PublicWork = +d.PublicWork;
        d.SelfEmployed = +d.SelfEmployed;
        d.PercentUnemploymed = +d.PercentUnemploymed;
      });
      xColumn = data.columns[1];
      render();
    });

}(d3));

