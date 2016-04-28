var React = require('react')
var $ = require('jquery')

var DateForm = React.createClass({

  getInitialState: function(){
    return{rows: []};
  },



  render: function(){
    //console.log("look", this.props.origDate, this.props.stopDate);
    //console.log("look", new Date(this.props.origDate), new Date(this.props.stopDate));

    if(this.props.origDate)
    {
          //populate dropdown lists
          var todayDate = new Date();

          var lastdate;

          if (todayDate < this.props.stopDate){
            lastdate = todayDate;
          }
          else{
            lastdate = this.props.stopDate;
          }

          //var lastDate = (todayDate < this.props.stopDate ? todayDate: this.props.stopDate);
          //console.log(todayDate, this.props.stopDate, lastdate);


          var monthNames = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];

          var odate = (this.props.origDate);
          //var lastdate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());

          var dropdates = [];
          var monthyear = "";

          //console.log("test", odate)


          while (odate.getTime()<lastdate.getTime())
          {
            //console.log("here-here");
            monthyear = monthNames[odate.getMonth()]+ " " + odate.getFullYear();
            dropdates.push({label: monthyear, val: odate.getTime()});
          //console.log({label: monthyear, val: startdate.getTime()});

          //CAN PROBABLY USE js Date to handle switching years?
          if (odate.getMonth()>=11) {
            odate = new Date(odate.getFullYear()+1, 0, 1); 
          }
          else{
            odate = new Date(odate.getFullYear(), odate.getMonth()+1, 1);   
          };
        } 

        
        
        var rows = dropdates.map(function(daterow, i){
          return <DateRow data={daterow} key={i} /> 
        });

        //console.log(dropdates, odate, rows);

        return (
          <div>
          Drop down of dates
          <select onChange={this.props.onChangeSelect}>
          {rows}
          </select>
          </div>
          );

      }
      else
      {
        return (
          <div>
          Default
          </div>
          );  
      }      
    }

  });


var DateRow = React.createClass({
  render: function(){
    return (
      <div>
      <option value={this.props.data.val} >{this.props.data.label}</option>
      </div>
      )
  }
});

module.exports = DateForm