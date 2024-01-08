require("dotenv").config()
const { google } = require("googleapis")
const sheets = google.sheets({ version: "v4" })
const creds = './credentials.json'

module.exports = {
    route: "users/messages",
    method: 'POST',
    run: async (req, res) => {
        try {
            const { sender, receiver, type, message } = req.query
            const auth = await google.auth.getClient({
                keyFile: creds,
                scopes: ['https://www.googleapis.com/auth/spreadsheets']
            });

            const resource = {
                values: [[sender, receiver, type, message]],
            };
            const spreadsheetId = process.env.DATABASE_ID
            const range = 'Messages!A:D'

            sheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range,
                valueInputOption: 'USER_ENTERED',
                resource,
            })

            res.status(200).json({
                status: 200,
                message: "OK",
            })
        } catch (e) {
            console.log(e)
            res.status(500).json({
                status: 500,
                message: "INTERNAL SERVER ERROR"
            })
        }
    }
}