
const dataURL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'

const promiseData = async () => {
    const res = await fetch(dataURL)
    const json = await res.json()
    console.log(json)
    return json
}

const month = ['January', 'February', 'March','April', 'May','June','July', 'August','September','October','November','December']

const parsedDate = date => date.split('-').slice(0,2).map(d => d > 12 ? d : month[d - 1]).reverse().join(' ')

const formatTooltip  = data => {
    const date = parsedDate(data[0])
    return `\$${data[1]} Billion<br/><span class='date'>${date}</span>`
}

const loadViz = json => {

    const data = json.data

    const barWidth = 3

    const scaled = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[1])])
        .range([0, 480])

    const div = d3.select('body').append('div')
        .attr('class', 'tooltip')
            .style('opacity', 0)

    const svg = d3.select('body')
        .append('svg')
        .attr('width', barWidth * data.length + 20)
        .attr('height', 500)

    svg.append('text')
        .attr('x', 30)
        .attr('y', 50)
        .text(json.source_name)

    svg.append('text')
        .attr('x', 32)
        .attr('y', 72)
        .attr('class', 'gdp')
        .text(`Quarterly ${json.name.split(',')[0]} (billions)`)

    const bar = svg.selectAll('g')
        .data(data)
          .enter().append('g')
          .attr('transform', (d, i) => `translate(${i * barWidth + 10}, ${490 - scaled(d[1])})`)

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
                .style('top', (d3.event.pageY - 72) + 'px');
        }).on('mouseout', function(d) {
            div.transition()
                .duration(500)
                .style('opacity', 0);
        })

}

document.addEventListener('DOMContentLoaded', () => {

    promiseData().then(data => loadViz(data))

})
