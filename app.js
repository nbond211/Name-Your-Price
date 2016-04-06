var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var rp = require('request-promise');
var async = require("async");
var port = 5000;

app.use(express.static('public'));
app.use(express.static('src/views'));


app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/src/views/index.html');
});


app.post('/scrape', function (req, res) {

    var genre = req.body.genre;
    var sort = req.body.sort;
    var page = req.body.page;
    
    var options = {
        uri: 'https://bandcamp.com/tag/'+genre+'?page='+page+'&sort_field='+sort,
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    var items = [];
    var nyp = [];
    

    async.waterfall([
function (callback) {
            rp(options)
                .then(function ($) {
                    for (var i = 0; i < $('.item').length; i++) {

                        var item = {
                            albumName: $($($('.item')[i]).find('.itemtext')[0]).text(),
                            artistName: $($($('.item')[i]).find('.itemsubtext')[0]).text(),
                            artworkUrl: $($($('.item')[i]).find('.art')[0]).attr('onclick').replace("return 'url(", "").replace(")'", ""),
                            albumUrl: $($($('.item')[i]).find('a')[0]).attr('href')
                        };

                        items.push(item);
                    }

                })
                .catch(function (err) {})

            .finally(function () {
                callback(null, items);

            });
        },
    function (items, callback) {

            async.each(items, function (item, callback) {

                rp({
                        uri: item.albumUrl,
                        transform: function (body) {
                            return cheerio.load(body);
                        }
                    })
                    .then(function ($) {
                        if ($('.buyItemNyp').text().indexOf("name your price") != -1) {
                            item.lgArtworkUrl = $($('a.popupImage').find('img')[0]).attr('src');
                            item.id = $('meta[property="og:video"]').attr('content').replace("https://bandcamp.com/EmbeddedPlayer/v=2/album=", "").replace("/size=large/tracklist=false/artwork=small/", "");
                            nyp.push(item);
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    })

                .finally(function () {
                    callback(null, nyp);
                });

            }, function (err) {
                callback(null, nyp);
            });
    }
], function (err, result) {
        res.send(result);
    });

});


app.listen(port, function () {});