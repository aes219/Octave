const { google } = require("googleapis");

const { readFileSync } = require("fs");
const { join } = require("path");

const credsPath = join(process.cwd(), 'credentials.json');
const creds = JSON.parse(readFileSync(credsPath, 'utf8'));

module.exports = {
    route: "users/messages",
    method: "GET",
    run: async (req, res) => {
        try {
            const { client, recipient } = req.query;

            const auth = await google.auth.getClient({
                credentials: creds,
                scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
            });

            const sheets = google.sheets({ version: "v4", auth });
            const spreadsheetId = process.env.SHEET_ID; 
            const range = "Messages!A:Z";

            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            });

            const values = response.data.values;
            if (!values || values.length === 0) {
                return res.status(200).json([]);
            }

            const headerRow = values.shift();

            const Data = values
                .filter(row =>
                    (row[0] == client && row[1] == recipient) ||
                    (row[0] == recipient && row[1] == client)
                )
                .map(row => {
                    const obj = {};
                    headerRow.forEach((key, index) => {
                        obj[key] = row[index] || "";
                    });
                    return obj;
                });

            res.status(200).json(Data);
        } catch (error) {
            console.error("Error fetching and filtering messages:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};