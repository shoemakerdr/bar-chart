import * as d3 from 'd3'

const dataURL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'

const promiseData = () => fetch(dataURL).then(res => res.json())

promiseData().then(console.log)
