// Import external packages
var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');
// Allow user to pass a command and data to liri
var liriCommand = process.argv[2];
var liriData = process.argv[3];

// Depending on command run a function
switch(liriCommand){
	case 'my-tweets':
		tweets();
		break;
	case 'spotify-this-song':
		spotifySong();
		break;
	case 'movie-this':
		movie();
		break;
	case 'do-what-it-says':
		doWhat();
		break;
}

// Function to append the command to a log file
function logCommand(){
	fs.appendFile('log.txt', '\r\n***' + liriCommand + '*** \r\n' , function(err){
		if(err){
		return console.log(err);
		}
	})
}

// Function for my-tweets command that displays a user's last 20 tweets
function tweets(){
	logCommand();
 
	var client = new Twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret
	});
	
	// Choose a user name to pull tweets from
	var params = {screen_name: 'BiffTannen'};
	console.log();
	console.log(params.screen_name + "'s last 20 tweets: ")
	console.log();
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	// Display 20 tweets to console and log them to a file
	  	for(var key in tweets){
		    console.log(parseInt(key) + parseInt(1) + " " + tweets[key].text);
		    console.log(tweets[key].user.created_at);
		    console.log();
		    fs.appendFile('log.txt', tweets[key].text + tweets[key].user.created_at + '\r\n' , function(err){
				if(err){
				return console.log(err);
				}
				})
	    }
	    fs.appendFile('log.txt', '\r\n' , function(err){
				if(err){
				return console.log(err);
				}
				})
	  }
	});
};

// function for spotify-this-song command
function spotifySong(){
	logCommand();

	var spotify = new Spotify({
		id: '6336729828b143318e68c44b069bae93',
		secret: 'b31ac4a67be24d42bdabf1b05e1a5e17'
	});
	if(liriData==undefined){
		// If no data given default to Ace of Base: The Sign data
		spotify.search({type: 'track', query: 'The Sign Ace of Base'}, function(err, data){
			if(err){
				return console.log("Error occurred: " + err);
			}
			// console.log(data.tracks.items);
			console.log();
			console.log('Artist(s): ' + data.tracks.items[0].artists[0].name);
			console.log('Song Name: ' + data.tracks.items[0].name);
			console.log('Preview Link: ' + data.tracks.items[0].preview_url);
			console.log('Album: ' + data.tracks.items[0].album.name);
		})
	}
	else{
		spotify.search({type: 'track', query: liriData}, function(err, data){
			if(err){
				return console.log("Error occurred: " + err);
			}
			for(var key in data.tracks.items){
				// For loop with if check to filter out undesired results
				// Display artist, song, preview, and album to user and log to a file
				if(data.tracks.items[key].name==liriData){
						console.log('Artist(s): ' + data.tracks.items[key].artists[key].name);
						console.log('Song Name: ' + data.tracks.items[key].name);
						console.log('Preview Link: ' + data.tracks.items[key].preview_url);
						console.log('Album: ' + data.tracks.items[key].album.name);
						fs.appendFile('log.txt', ' Artist(s): ' + data.tracks.items[0].artists[0].name + '\r\n Song Name: ' + data.tracks.items[0].name + '\r\n Preview Link: ' + data.tracks.items[0].preview_url+ '\r\n Album: ' + data.tracks.items[0].album.name + '\r\n', function(err){
							if(err){
								return console.log(err);
							}
						})
						return;
				}
			}
		})
	}
};

// function for movie-this command
function movie(){
	logCommand();
	// If user does not enter a movie show Mr. Nobody as default
	if(liriData == undefined){
		request('http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=40e9cece', function(error, response, body){
		if(!error && response.statusCode === 200){
			var movieData = JSON.parse(body);
			console.log(movieData.Title);
			console.log(movieData.Year);
			console.log(movieData.imdbRating);
			console.log(movieData.Country);
			console.log(movieData.Language);
			console.log(movieData.Plot);
			console.log(movieData.Actors);
			console.log('https://www.rottentomatoes.com/search/?search=' + movieData.Title);
		}
	})
	}
	// Show user's movie search with title, year, imdb rating, country, language, plot, and actors
	// and log thme to a file
	else{
		request('http://www.omdbapi.com/?t=' + liriData + '&y=&plot=short&apikey=40e9cece', function(error, response, body){
			if(!error && response.statusCode === 200){
				var movieData = JSON.parse(body);
				console.log(movieData.Title);
				console.log(movieData.Year);
				console.log(movieData.imdbRating);
				console.log(movieData.Country);
				console.log(movieData.Language);
				console.log(movieData.Plot);
				console.log(movieData.Actors);
				console.log('https://www.rottentomatoes.com/search/?search=' + movieData.Title);
				fs.appendFile('log.txt', ' Title: ' + movieData.Title + '\r\n Year: ' + movieData.Year + '\r\n IMDB Rating: ' + movieData.imdbRating + '\r\n Country: ' + movieData.Country + '\r\n Language: ' + movieData.Language + '\r\n Plot: ' + movieData.Plot + '\r\n Actors: ' + movieData.Actors + '\r\n', function(err){
				if(err){
				return console.log(err);
				}
				})
			}
		})
	}
};

// function for do-what-it-says command
function doWhat(){
	logCommand();
	var songDataArray;
	var song;
	// Grab data from a premade file
	fs.readFile('random.txt', 'utf8', function(error, data){
		if(error){
	 		console.log(error);
	 	}
	 	songDataArray = data.split(',');
	 	song = songDataArray[1];
	
	var spotify = new Spotify({
		id: '6336729828b143318e68c44b069bae93',
		secret: 'b31ac4a67be24d42bdabf1b05e1a5e17'
	});
	// Use that data to run a spotify search
 	spotify.search({type: 'track', query: song}, function(err, data){
		if(err){
			return console.log("Error occurred: " + err);
		}
		for(var key in data.tracks.items){
			if(JSON.stringify(data.tracks.items[key].name).toUpperCase()==song.toUpperCase()){
				console.log();
				console.log('Artist(s): ' + data.tracks.items[key].artists[key].name);
				console.log('Song Name: ' + data.tracks.items[key].name);
				console.log('Preview Link: ' + data.tracks.items[key].preview_url);
				console.log('Album: ' + data.tracks.items[key].album.name);
				fs.appendFile('log.txt', ' Artist(s): ' + data.tracks.items[0].artists[0].name + '\r\n Song Name: ' + data.tracks.items[0].name + '\r\n Preview Link: ' + data.tracks.items[0].preview_url+ '\r\n Album: ' + data.tracks.items[0].album.name + '\r\n ', function(err){
					if(err){
						return console.log(err);
					}
				})
				return;
			}
		}
	})	
	})
};