
var React = require('react')
var $ = require('jquery')
var d3 = require('d3')

var D3Donut = React.createClass({
	componentDidMount: function() {
		alert("Here");

		var width = "100%",
    height = "100%",
    radius = Math.min(width, height) / 2;
    //color = d3.scale.category20c();
	var artCircInnerRad = 150;

	var monthCircInnerRad = artCircInnerRad-20;
	var monthCircOuterRad = artCircInnerRad;
	var firstDraw = true;

	var svg = d3.select("#svgcontainer")
			.append("svg")
		    .attr("width", width)
		    .attr("height", height)
		    .attr("viewBox", "0 0 530 530")
		    .attr("class", "center-block")
		    //.attr("position", "absolute")
		  	.append("g")
		    .attr("transform", "translate(" + 265 + "," + 265 + ")");


    //this.loadCommentsFromServer();
    //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },

  render: function(){
    return (
      <div id="svgcontainer">
      Place Holder for SVG Container
      </div>
      )
  }
});

module.exports = D3Donut