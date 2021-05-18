const express = require("express");
const app = express();
const request = require('request');
const cors = require("cors");

app.use(cors());

// request payload middleware
app.use(express.json()); // allows for request content-type: "application/json"
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({url: process.env.CLIENT_URL})
});

app.get("/login", async (req, res) => {
    request.post({
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: req.query.code,
            redirect_uri: `${process.env.SERVER_URL}/login`,
            grant_type: 'authorization_code',
            client_id: process.env.SERVER_URL,
            client_secret: process.env.SERVER_URL,
        },
        json: true
    }, (error, response, body) => {
        if (error) {
            res.redirect(process.env.CLIENT_URL + '/error');
        } else {
            res.redirect(`${process.env.CLIENT_URL}/callback?access_token=${body.access_token}&refresh_token=${body.refresh_token}`)
        }
    });
});

app.get("/refresh", async (req, res) => {
    request.post({
        url: 'https://accounts.spotify.com/api/token',
        form: {
            refresh_token: req.query.refresh_token,
            grant_type: 'refresh_token',
            client_id: process.env.SERVER_URL,
            client_secret: process.env.SERVER_URL,
        },
        json: true
    }, (error, response, body) => {
        if (error) {
            res.json();
        } else {
            res.json({access_token: body.access_token});
        }
    });
});

app.listen(process.env.PROD);