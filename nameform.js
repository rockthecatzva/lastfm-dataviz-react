var React = require('react')
var $ = require('jquery')


var NameForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    var usrname = React.findDOMNode(this.refs.userName).value.trim();
    //console.log("Here", usrname);
    //var text = React.findDOMNode(this.refs.text).value.trim();
    if (!usrname) {
      return;
    }

    //var lastfmurl = 

    $.ajax({
      url: "http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user="+usrname+"&api_key=f90e2d0006fdbb56483b5ffd30d50612&format=json",
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        console.log("success", data);

        if(data.hasOwnProperty("user")){
          if(parseInt(data.user.playcount, 10)>0){
            //THE USER NAME IS VALID AND HAS DATA

            //record registration date
            // console.log(data.user.registered.unixtime);
            var _startDate = data.user.registered.unixtime;
            //console.log("start date", _startDate);
            this.props.onNameSucess(usrname, _startDate);
          }
        }




        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log("fail");
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });


    //this.props.onCommentSubmit({username: userName});
    React.findDOMNode(this.refs.userName).value = '';
  //  React.findDOMNode(this.refs.text).value = '';
},

render: function() {
  return (
    <form className="commentForm" onSubmit={this.handleSubmit}>
    <input class="form-control" placeholder="Enter LastFM username" type="text" ref="userName" /> 
    <input type="submit" value="Next" />

    </form>
    );
}
});

module.exports = NameForm