const axios = require('axios')
const { google } = require("googleapis")
const sheets = google.sheets({ version: "v4" })
const creds = './credentials.json'

module.exports = {
    route: "users/messages",
    method: 'GET',
    run: async (req, res) => {
        try {
            const { client, recipient } = req.query;
            const response = await axios.get(require('../api')('Messages'));
            const { values } = response.data;
            const headerRow = values.shift();

            const Data = values
                .filter(row =>
                    (row[0] == client && row[1] == recipient)
                    ||
                    (row[0] == recipient && row[1] == client)
                )
                .map(row => {
                    const obj = {};
                    headerRow.forEach((key, index) => {
                        obj[key] = row[index];
                    });
                    return obj;
                });

            res.send(Data);
        } catch (error) {
            console.error("Error fetching and filtering messages:", error);
            res.status(500).send("Internal Server Error");
        }
    }
};
