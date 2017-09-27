import * as d3 from 'd3'

const dataURL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'

const promiseData = async () => {
    const res = await fetch(dataURL)
    const json = await res.json()
    console.log(json)
    return json.data
}

const month = ['January', 'February', 'March','April', 'May','June','July', 'August','September','October','November','December']

const parsedDate = date => date.split('-').slice(0,2).map(d => d > 12 ? d : month[d - 1]).reverse().join(' ')

const formatTooltip  = data => {
    const date = parsedDate(data[0])
    return `\$${data[1]} Billion<br/><span class='date'>${date}</span>`
}

const loadViz = data => {

    const barWidth = 4

    const scaled = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[1])])
        .range([0, 580])

    const div = d3.select('body').append('div')    
        .attr('class', 'tooltip')                
            .style('opacity', 0)

    const svg = d3.select('body')
        .append('svg')
        .attr('width', barWidth * data.length + 20)
        .attr('height', 600)

    const bar = svg.selectAll('g')
        .data(data)
          .enter().append('g')
          .attr('transform', (d, i) => `translate(${i * barWidth + 10}, ${595 - scaled(d[1])})`)

    bar.append('rect')
        .attr('width', barWidth - 1)
        .attr('height', d => scaled(d[1]))
        .attr('fill', 'black')
        .on('mouseover', d => {        
            div.transition()        
                .duration(200)        
                .style('opacity', .9)        
            div.html(formatTooltip(d))    
                .style('left', (d3.event.pageX) + 'px')        
                .style('top', (d3.event.pageY - 28) + 'px');    
        }).on('mouseout', function(d) {        
            div.transition()        
                .duration(500)        
                .style('opacity', 0);    
        })

}

document.addEventListener('DOMContentLoaded', () => {

    promiseData().then(data => loadViz(data))

})
