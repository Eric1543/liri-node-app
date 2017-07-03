# liri-node-app

This is a command-line app that takes in one of 4 possible commands (my-tweets, spotify-this-song, movie-this, do-what-it-says),
along with additional parameters for some commands and it then runs a function with a corresponding API call to then display
results to the user.

For my-tweets, it will display back the last 20 tweets from a specific user name by using the twitter API.

For spotify-this-song, if a song is passed in it will display results such as artist name, song name, preview link and album, 
else it will display a default of Ace of Base the sign details if nothing is passed in. Via spotify API

For movie-this, it will display movie title, release year, IMDB rating, country, language, plot, and actors, with a default of
Mr.Nobody if no movie is passed in. Via OMDB API

For do-what-it-says, the liri program will read a text file to take in the song name from that external file and pass it to 
the spotify API to display the spotify-this-song results to the user.
