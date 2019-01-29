require("dotenv").config();
var keys = require("./keys");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var axios = require("axios");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

App(process.argv[2], process.argv[3]);

function App(command, params) {

    switch (command) {
        case "concert-this":
            bandConcerts(params);
            break;
        case "spotify-this-song":
            getSpotifySong(params);
            break;
        case "movie-this":
            getMovie(params);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;

        default:
            "Liri doesn't know that command.  Please try again."
            break;
    }
}

function bandConcerts(params) {

    params ? "" : params = "drake";

    var queryURL = "https://rest.bandsintown.com/artists/" + params + "/events?app_id=codingbootcamp";

    axios.get(queryURL)
        .then(function (response) {
            var data = response.data;

            console.log("===============================================");
            console.log("Place and dates " + params + " is showing: ");

            for (let i = 0; i < data.length; i++) {
                console.log(data[i].venue.name);
                console.log(data[i].venue.city);
                console.log(data[i].venue.country);
                console.log(moment(data[i].datetime, "YYYY-MM-DD").format("MM/DD/YYYY"));
                console.log("=============================");

            }

        })
        .catch(function (error) {
            console.log(error);
        })
}

function getSpotifySong(params) {

    params ? "" : params = "The Sun Goes Down";

    spotify
        .search({
            type: 'track',
            query: params
        })
        .then(function (response) {
            console.log(JSON.stringify(response, null, 2));
            // console.log("Artist: ", response.)
        })
        .catch(function (err) { 
            console.log(err);
        });
}

function getMovie() {
    var movie = process.argv[3];
    var queryURL = 'http://www.omdbapi.com/?t=' + movie + '&y=&plot=short&apikey=trilogy';

    axios.get(queryURL)
        .then(function (response) {
            // checking if it work
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        })

        // If it error, it will show a movie name "Mr. Nobody"
        .catch(function (error) {
            console.log("------------------------------------");
            console.log("You did not input movie name on " +
                error);
            console.log("------------------------------------");
            console.log("If you haven't watched 'Mr. Nobody,' then you should check this link : http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!")
            //adds text to log.txt

        });
}


function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
        // Each command is represented. Because of the format in the txt file, remove the quotes to run these commands. 
        for (i = 0; i < dataArr.length; i++) {
            var readFile = dataArr[i];
            var insideFile = dataArr[i + 2];
            App(readFile, insideFile);
        }
    })
};