



var $ = require('jquery')
var React = require('react')
var DateForm = require('./dateform.js')
var NameForm = require('./nameform.js')
var DonutChart = require('./donutchart.js')
var LastFMServices = require('./lastfmservices.js')

var CommentBox = React.createClass({

  loadCommentsFromServer: function() {
    /*
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
*/
},


handleNameSuccess: function(name, origdate){
  console.log("parent triggered - Name sucessfully checked out", name, origdate);
  this.setState({user : name});
  this.setState({origdate: new Date(origdate*1000)});
},


getInitialState: function() {
  return {
    data: [],
    selectedDate: "",
    startDate: ""
  };
},

startDateSelected: function(e){
  var d = new Date (parseInt(e.target.value));

  this.setState({startDate: d});
  console.log("Start date selected!!!", e.target.value, d);
  this.setState({stopDate: new Date (parseInt(e.target.value))});
    //this.forceUpdate();
  },

  stopDateSelected: function(e){
    var d = new Date (parseInt(e.target.value));
    
    this.setState({stopDate: d});
    console.log("STOP date selected!!!", this.state.startDate, this.state.stopDate);

    //this.forceUpdate();
  },


  updateDonut: function(labels, data){
    alert("donut data has returned!");

    this.setState({donutdata: data});

  },


  startGraphic: function(){


    this.setState({dataservice: LastFMServices.getData(this.state.user, this.state.startDate, this.state.stopDate, this.updateDonut)});
},

componentDidMount: function() {
    //this.loadCommentsFromServer();
    //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    var d = new Date(new Date(this.state.startDate).setMonth(new Date(this.state.startDate).getMonth()+12));
    //console.log(" heres the date", this.state.startDate, d);
    var monthNames = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];


    return (
      <div className="commentBox">
      <h1>Listening Profile for {this.state.user} {monthNames[new Date(this.state.startDate).getMonth()]} {new Date(this.state.startDate).getFullYear()} thru {monthNames[new Date(this.state.stopDate).getMonth()]} {new Date(this.state.stopDate).getFullYear()}</h1>
      <NameForm onNameSucess={this.handleNameSuccess} />
      <DateForm origDate={this.state.origdate} onChangeSelect={this.startDateSelected} stopDate={new Date()}/>
      <DateForm origDate={this.state.startDate} stopDate={d} onChangeSelect={this.stopDateSelected}/>

      <button onClick={this.startGraphic} type="button">Go</button>

      <DonutChart startDate={this.state.startDate} stopDate={this.state.stopDate} user={this.state.user} donutData={this.state.donutdata}/>      

      </div>
      );
  }
});


/*



var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment, index) {
      return (
        // `key` is a React-specific concept and is not mandatory for the
        // purpose of this tutorial. if you're curious, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        <Comment author={comment.author} key={index}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});
*/


React.render(
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
  );
