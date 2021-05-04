const express = require('express');
const request = require('request');
const MongoClient = require('mongodb').MongoClient;

const app = express(); 
const connectionString = 'mongodb+srv://marcel:Williams77@captone-server.x71z7.mongodb.net/moviesdb?retryWrites=true&w=majority' //  connection string 

app.get('/getdata/:id', function(req, res) { 
    if (!req.params.id) { 
       res.status(500); 
       res.send({"Error": "No ID"}); 
    } 
    request.get(
        { url: "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1" + req.params.id }, 
        function(error, response, body) { 
            if (!error && response.statusCode == 200) { 
                // get data from body ... e.g. title
                const data = JSON.parse(body);
                const title = data.title || '';

                // store in mongodb
                MongoClient.connect(connectionString, (err, client, done) => {
                    done();
                    // Handle connection errors
                    if(err) {
                        console.log(err);
                        return res.status(500).json({success: false, data: err});
                    }
                    // MQL Query > Insert Data
                    client.query('INSERT INTO moviesdata(id, title) values($1, $2)', [req.params.id, title]);

                    res.json({title: title}); 
                })
            } 
        }
    ); 
    console.log("You Sucessfully populated your database with external API data");
}); 
