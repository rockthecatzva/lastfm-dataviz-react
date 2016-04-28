var $ = require('jquery')
var $q  = require('q')


var LastFMServices = {};

//TO DO
//THESE SHOULD BE NESTED IN THE JS OBJECT!!!!
//most of the fuctions below dont need to be public!!!!

var _monthlyData;
var _fmname;
var totalPlays = 0;
var monthNames = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
var _onComplete;


/*

LastFMServices.checkUserStatus = function(usr)
{
			//THIS SHOULD BE HERE NO NAMEFORM!!!
		}

		var _monthlyData;
		var _fmname;
		var _totalPlays;
		var _totalArtists;
		var _finalMonthlyData;
		var _donutdata;
		var _artistList;
		var _genreList;


		this.reset = function(){
			_monthlyData = [];
			_totalPlays = 0;
			_totalArtists = 0;
			_finalMonthlyData = [];
			_donutdata = [];		
			_artistList = [];
		}

		this.reset();


		var findUniqueArtists = function(dataset)
		{	
			var uniqueset = [];

			for (var i = 0; i < dataset.length; i++) {
				found = false;

				for (var b = 0; b < uniqueset.length; b++) {
					if(dataset[i].name == uniqueset[b]){
						found = true;
						console.log("found duplicate artist", uniqueset[b]);
						break;
					}
				}

				if ((!found))
				{
					uniqueset.push(dataset[i].name);
				};
				found = false;	
			}
			return uniqueset
		}

		var isArtistUnique = function(findArt)
		{
			var found=false;


			for (var i = 0; i < _artistList.length; i++) {
				if (_artistList[i]==findArt){
					found=true;
					break;
				}
			};

			if(!found)
			{
				_artistList.push(findArt);
				_totalArtists += 1;
			}
		}

		var updateGenreLegend = function(finaldata)
		{

			var genreLookup = [
			["COMEDY", ""],
			["GANGSTA RAP", ""],
			["HIP-HOP", ""],
			["PROGRESSIVE ROCK", ""],
			["SOUL", ""],
			["TRIP-HOP", ""],
			["80S", ""],
			["ACID JAZZ", ""],
			["ALTERNATIVE", ""],
			["AMBIENT", ""],
			["BLUES", ""],
			["CLASSIC ROCK", ""],

			];


			_genreList = [];
			var found = false;

			for (var i = 0; i < finaldata.length; i++) {
				found = false;
				for (var b = 0; b < _genreList.length; b++) {
					if(finaldata[i].genre == _genreList[b]){
						found = true;
						break;
					}
				};

				if(!found)
				{
					_genreList.push(finaldata[i].genre);
					found = false;
				}


			};




			_genreList.sort();

			console.log("printing legend", _genreList)

		}

		var sumArtistsList = function(wklyset, monthlyset)
		{	

			var foundmatch = false;

			for (var i = 0; i < wklyset.length; i++) {
				foundmatch = false;
			//console.log("this," , _totalPlays);
			_totalPlays += parseInt(wklyset[i].playcount);



			for (var b = 0; b < monthlyset.length; b++) {
				if(monthlyset[b].name==wklyset[i].name){
					foundmatch = true;
				//	_totalPlays += parseInt(wklyset[i].playcount);
				monthlyset[b].playcount += parseInt(wklyset[i].playcount);
				break;
			}
		};


		if(!foundmatch)
		{
			monthlyset.push({name: wklyset[i].name, playcount: parseInt(wklyset[i].playcount), genre: "Other"});

				//check if this is a new unique artist for the entire set!
				isArtistUnique(wklyset[i].name);
			}
			
			foundmatch = false;
			
		};

		console.log("Done summing", monthlyset.length);
		return monthlyset;
	}

*/


	var loadDataFromUrls = function(itemlist, baseurl) {
          var deferred = $q.defer();
          
          var urlCalls = [];
          var t = "";
          var url = "";
          console.log("item list ", itemlist);
          var tmpcall;

          for (var i = 0; i < itemlist.length; i++) {
          	if(itemlist[i]!=null)
          	{
				url = baseurl+itemlist[i]+"&api_key=f90e2d0006fdbb56483b5ffd30d50612&format=json";
				console.log("week num: ", itemlist[i], url);
				tmpcall = $.ajax({
			      url: url,
			      dataType: 'json',
			      type: 'GET'});

	            urlCalls.push(tmpcall);
        	}
          };
          
          $q.all(urlCalls)
          .then(
            function(results) {
            	console.log("all results", results);
            deferred.resolve(results); 
          },
          function(errors) {
            deferred.reject(errors);
          },
          function(updates) {
            deferred.update(updates);
          });


          return deferred.promise;
        }



	var getWeeklyArtistList = function(wkList, monthset)
	{
		//var url = "http://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user="+_fmname+"&from="+wkList[0]+"&api_key=f90e2d0006fdbb56483b5ffd30d50612&format=json";	
		var sync_url = "http://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user="+_fmname+"&from=";





		var t = loadDataFromUrls(wkList, sync_url).then(
			function(data)
			{
				console.log("GETWEEKLYARTISTLIST back at caller", data);
				var thisStart, lastStart = 0;
				var monthset= [];

				function compare(a, b) {
					if(a.playcount > b.playcount)
						return -1;
					if (a.playcount<b.playcount)
						return 1;
					return 0;
				};

						//go thru weekly data - 
						for (var i = 0; i < data.length; i++) {
							thisStart = new Date(wkList[i]*1000);
							nextStart = new Date(wkList[i]*1000);
							nextStart.setDate(nextStart.getDate()+7);	

							//console.log(data[i].data.weeklyartistchart.hasOwnProperty("artist"));

							if(data[i].data.hasOwnProperty("weeklyartistchart")){
								if (data[i].data.weeklyartistchart.hasOwnProperty("artist")) {
									//add weekly data to monthly set
									if(data[i].data.weeklyartistchart.artist.length>0)
									{
										monthset = sumArtistsList(data[i].data.weeklyartistchart.artist, monthset);		
									}
									else{//no artists in the artist list from server
										console.log("Week had the property, but no DATA!!!!----!!!!!-----!!!")
									}
								}//no artist property
								else
								{
									console.log("----missing a week of data --------");	
								}

					    	}//no weeklyartistchart propert
					    	else
					    	{
					    		console.log("here too?  ----missing a week of data --------");	
					    	}
					    	

							//check if this is a new month or last week in the set
							//console.log(nextStart.getDate()<thisStart.getDate(), nextStart.getDate(), thisStart.getDate());
							if(((nextStart.getDate()<thisStart.getDate())&&(i>0)) || (i==data.length-1))
							{	
								console.log("Found end of month", data[i]);

								if (monthset.length>0)
								{
									//sort artists by total plays
									monthset.sort(compare);

									//truncate lists to 10 per month
									monthset = monthset.splice(0, 10);
									
									//keep only top  - 10
									//ad these 10 to the final data set
									for (var b = 0; b < monthset.length; b++) {
										_finalMonthlyData.push(monthset[b]);
									};
									
								}
								else
								{
									//NO DATA RETURNED FOR THE MONTH - 
									console.log("EMPTY MONTH!!!");

									//var emptyMonth = [];
									for (var b = 0; b < 10; b++) {
										//emptyMonth.push([])
										_finalMonthlyData.push({
											'genre': "",
											'name': null,
											'playcount': 0
										});
									};
								}
								
						    	//reset monthly data
						    	monthset = [];	
						    }	
						};


						//if finaldataset is not empty
						if(_finalMonthlyData.length>0)
						{
							
							console.log("Finished creating final data set", _finalMonthlyData);

							//get genre data added to the set
							var uniqArtistList = findUniqueArtists(_finalMonthlyData);
							console.log("here are the uniq artists", uniqArtistList.length, uniqArtistList);

							var t = asyncService.loadDataFromUrls(uniqArtistList, "http://ws.audioscrobbler.com/2.0/?method=artist.getTopTags&artist=").then(
								function(data){
									//genre tags have been returned
									console.log("back at caller - for tag data", data);

									//marry donut data with genre names
									for (var i = 0; i < data.length; i++) {
										
										if(data[i].data.hasOwnProperty("toptags"))
										{
											if(data[i].data.toptags.hasOwnProperty("tag"))
											{
												//console.log(data[i].data.toptags.tag.length);

												if(data[i].data.toptags.tag.length>0)
												{
													thistag = data[i].data.toptags.tag[0].name.toUpperCase();

													for (var b = 0; b < _finalMonthlyData.length; b++) {
														//console.log(_finalMonthlyData[b].name == data[i].data.toptags['@attr'].artist, _finalMonthlyData[b].name , data[i].data.toptags['@attr'].artist);
														if(_finalMonthlyData[b].name == uniqArtistList[i])
														{
															_finalMonthlyData[b].genre = thistag;//genreGroups[thistag];
															console.log("RESET THE GENRE TAG");
														}
													};
												}
												

											}
										}
									};

									console.log(_finalMonthlyData);
									updateGenreLegend(_finalMonthlyData);
									D3Service.drawDonut(_finalMonthlyData);

								});





							//have d3 draw the data
						}
						else
						{
							//no data returned - the data set is filled with null data, but there are zero plays
							alert("Sorry this user & date combination yielded data.");
						}


					});

}



LastFMServices.getData = function(fmName, start, stop)
{
			//start = start;
			console.log("init", start, stop)
			//stop = new Date(stop*1000);
			//console.log("d1", stop);
			stop = (new Date(stop.getFullYear(), stop.getMonth()+1, 0).getTime())/1000;
			console.log("d2", stop);
		//	monthLabelSet = [];

		_fmname = fmName;

		var url = "http://ws.audioscrobbler.com/2.0/?method=user.getweeklychartlist&user="+fmName+"&api_key=f90e2d0006fdbb56483b5ffd30d50612&format=json";


		$.ajax({
			url: url,
			dataType: 'json',
			type: 'GET',
			success: function(data) {
				console.log("success", data);
				weekDefs = data.weeklychartlist;

				//var d;
				//var totalWeeks = 0;
				//var startWeekNum = 0;
				var wkSet = [];
				realWeekStart = null;

				for(chart in weekDefs.chart)
				{	
						//console.log(chart, stop, weekDefs.chart[chart].to);		
						//NOT SURE HOW I FEEL ABOUT THIS SECTION DOWN HERE
						//find start week	
						//console.log(weekDefs.chart[chart].from, start, new Date(start).getTime()/1000);
						if((weekDefs.chart[chart].from > new Date(start).getTime()/1000)&&(!realWeekStart))
						{
							console.log(weekDefs.chart[chart-1], chart);

							if(chart>0)
							{
								//d = new Date(weekDefs.chart[chart-1].to*1000);
								realWeekStart = weekDefs.chart[chart-1].from;
								//startWeekNum = chart-1;
							}
							else
							{
								//d = new Date(weekDefs.chart[chart].to*1000);
								realWeekStart = weekDefs.chart[chart].from;
								//startWeekNum = chart;	
							}


							console.log("found start week", realWeekStart);
							wkSet.push(realWeekStart);
						}

						if(realWeekStart)
						{			
				    		//find stop week - the count # of weeks.			    	
				    		wkSet.push(weekDefs.chart[chart].from);
				    		console.log(weekDefs.chart[chart].from, start, stop, new Date(stop).getTime()/1000)
				    		if(weekDefs.chart[chart].to >= stop)
				    		{
				    			
				    			//totalWeeks = ((chart) - startWeekNum)+1;//the plus 1 is because these are indexs and start at 0
				    			console.log("found stop week", wkSet, stop);	
				    			break;
				    		}	
				    	}
				    }

				    finalMonthlyData = [];


				    getWeeklyArtistList(wkSet, []);
				}.bind(this),
				error: function(xhr, status, err) {
					console.log("fail");
					console.error(this.props.url, status, err.toString());
				}.bind(this)
			});
}




module.exports = LastFMServices