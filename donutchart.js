

var React = require('react')
var $ = require('jquery')
var d3 = require('d3')


var DonutChart = React.createClass({

  getInitialState: function(){
    return {
      "artCircInnerRad": 150,
      "monthCircInnerRad": 130,
      "monthCircOuterRad": 150,
    };
  },

  componentWillUpdate: function(nextProps,nextState)
  {
    console.log("donut got new props --- ", this.props, nextProps);

    if((nextProps.startDate!=this.props.startDate)||(nextProps.stopDate!=this.props.stopDate)){
      //console.log("not just a user name update!!!", nextProps);
      this.drawInnerCircle(nextProps.startDate, nextProps.stopDate);  
    };


    if(nextProps.donutData!=this.props.donutData){
      console.log("rec donut data");
      //alert("WOWOOWOWOWOWOW");
      this.drawDonut(nextProps.donutData);
    }

    
  },

  drawDonut: function(toplists)
  {
    console.log("in draw donut", toplists);

    d3.select("#visgroup").remove();

    var slideW = (Math.PI*2)/(toplists.length);
    var currentStart = 0;
    
    var minBarH = 10;
    var maxBarH = 100;



    function findPlayCtRange()
    {

      var min=toplists[0].playcount;
      var max = toplists[0].playcount;

      for (var i = 1; i < toplists.length; i++) {
       if (toplists[i].playcount>max) max = toplists[i].playcount;
       if (toplists[i].playcount<min) min = toplists[i].playcount;
         //console.log(toplists[i].playcount);
       };

       return [max, min];
     }

     var scale = d3.scale.linear();
     scale.domain(findPlayCtRange());
     scale.range([this.state.artCircInnerRad+maxBarH, this.state.artCircInnerRad+minBarH]);

     var temparc = d3.svg.arc()
     .innerRadius(this.state.artCircInnerRad)
     .outerRadius(function(d,i){
                    //console.log(i, d.playcount, scale(d.playcount));
                    //return scale(d.playcount);})
     return this.state.artCircInnerRad;})
     .startAngle(function(d){return currentStart})
     .endAngle(function(d,i){
      currentStart += slideW;
      return currentStart;
    });

     var arc = d3.svg.arc()
     .innerRadius(this.state.artCircInnerRad)
     .outerRadius(function(d,i){
                    //console.log(i, d.playcount, scale(d.playcount));
                    var size = d.playcount > 0 ? scale(d.playcount) : this.state.artCircInnerRad;



                    return size;})
     .startAngle(function(d){return currentStart})
     .endAngle(function(d,i){
      currentStart += slideW;
      return currentStart;
    });

     var visgroup = this.state.svg.append("g").attr("id", "visgroup").attr("class", "datadonut");

     var donutgroup = visgroup.append("g")
     .selectAll("path")
     .data(toplists)
     .enter()
     .append("g")
     .attr("class", function(d){return d.genre.replace(' ', '_')})

     .on("mouseover", function(d){
      addCenterText(d);
                    //alert(this);
                    //d3.select(this).select("path").style("stroke","#ffffff").attr("stroke-width", 2);
                    d3.select(this).select("path").attr("class", "null")
                    d3.selectAll(".slice").style("fill", "#383A4C");


                  })
     .on("mouseout", function(d){
                    //d3.select(this).select("path").style("stroke","#4d4e59").attr("stroke-width", 1)
                    d3.select(this).select("path").attr("class", "slice")
                    d3.selectAll(".slice").style("fill", null);
                  });


     donutgroup.append("path").attr("d", temparc)

     .attr("class", "slice")

     .transition()
     .attr("d", arc)
     .duration(800);

     visgroup.append("foreignObject")
     .attr("width", 250)
     .attr("height", 100)
     .attr("x", -(125))
     .attr("y", -(50))
     .append("xhtml:div")
     .attr("id", "centerbox")
     .style("visibility", "hidden")
     .html(function(d){
      return ""
    });


     function removeCenterText()
     {
      //alert("here");
      //d3.select("#centerbox").style("visibility", "hidden");
    } 

    function addCenterText(d)
    { 

      var nam =d.name.toUpperCase();
      var pct = d.playcount;

      d3.select("#centerbox").style("visibility", "visible");
      
      d3.select("#centerbox")
      .html(function(d){
        return "<span class='artname'>"+nam+"</span><br/><span class='playnum'>"+pct+" PLAYS</span>"
      }); 
    }

    

  },


  drawInnerCircle: function(start, stop)
  { 

    //console.log("here are the stop and start dates", start, stop);
    var months = [];
    //var start= new Date(parseInt(start));
    var curr = new Date(start);
    //var stop= new Date(parseInt(stop)); 


    var monthNames = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];

    months.push(monthNames[curr.getMonth()]);
    curr = new Date(curr.setMonth(curr.getMonth()+1));
    
    while(curr<=stop)
    { 

      months.push(monthNames[curr.getMonth()]);
      curr = new Date(curr.setMonth(curr.getMonth()+1));
      console.log("in it", curr, stop);
    }

    console.log("month set for labels", months);

    var dataSet= [];

    d3.select("#monthcircle").remove();
    d3.select("#visgroup").remove();

    var innervis = this.state.svg.append("g")
    .attr("id", "monthcircle")
    .data([dataSet]);


    if(months.length<2)
    {
      innervis.attr("transform", "rotate(180)");
    }

    for (var i = 0; i < months.length; i++) {
      dataSet.push({"legendLabel":months[i], "magnitude":1});
    };

    
        //console.log(dataSet);
        var monthCircOuterRad= this.state.monthCircOuterRad;

        var arc = d3.svg.arc()
        .innerRadius(this.state.monthCircInnerRad)
        .outerRadius(this.state.monthCircOuterRad);

      var pie = d3.layout.pie() //this will create arc data for us given a list of values
      .value(function(d) { 
          //console.log(d.legendLabel, d.startAngle);
        return d.magnitude; }) // Binding each value to the pie
      .sort( null);


      // Select all <g> elements with class circleseg (there aren't any yet)
      var arcs = innervis.selectAll("g.circleseg")
      .data(pie)
      .enter()
      .append("svg:g")
      .attr("class", "circleseg")
      .attr("fill", "#46495E");
        //.attr("stroke", "red");    


        arcs.append("svg:path")
        //.attr("fill", function(d, i) { return color(i); } )
        .attr("d", arc)
        .attr("id", function(d,i){
            //console.log("path"+d.startAngle);
            return ("path"+i);});

      // Add a legendLabel to each arc circleseg...
      arcs.append("svg:text")

        .attr("transform", function(d) { //set the label's origin to the center of the arc
          //we have to make sure to set these before calling arc.centroid
          d.outerRadius = monthCircOuterRad; // Set Outer Coordinate
          d.innerRadius = monthCircOuterRad; // Set Inner Coordinate
          return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
        })
        .attr("dy", "0.32em")
        .attr("text-anchor", "middle") //center the text on it's origin
        .attr("class", "month-label")
        .style("fill", "white")
        //.attr("xlink:href",function(d,i){return ("#path"+i);})
        .text(function(d, i) { return dataSet[i].legendLabel; }); //get the label from our original data array

      // Computes the angle of an arc, converting from radians to degrees.
      function angle(d) {
        var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 180;
        //console.log(a < 180 ? a + 180 : a, a);
        return a < 180 ? a + 180 : a;
      }

      
    },







    componentDidMount: function() {


    //var el = this.getDOMNode();
    //console.log("in d3", el);
    
    var width = "100%",
    height = "100%";
    radius = Math.min(width, height) / 2;
    //color = d3.scale.category20c();
    
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

        //console.log(svg, d3.select("#svgcontainer"));

        this.setState({"svg": svg});

      },

      render: function() {
        //this.drawInnerCircle(this.props.startDate, this.props.stopDate); 

        return (
          <div id="svgcontainer">
          Place Holder
          </div>
          );
      }
    });

module.exports = DonutChart