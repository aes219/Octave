require('dotenv').config()
const { google } = require('googleapis');
const sheets = google.sheets({ version: 'v4' })
const creds = './credentials.json'

module.exports = {
    route: 'users/profiles',
    method: 'POST',
    run: async (req, res) => {
        try {
            const { email, nick, bio } = req.query
            const auth = await google.auth.getClient({
                keyFile: creds,
                scopes: ['https://www.googleapis.com/auth/spreadsheets']
            });

            const resource = {
                values: [[email, nick, bio]],
            };
            const spreadsheetId = process.env.DATABASE_ID
            const range = 'Profiles!A:Z'

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
                status: 200,
                message: "Internal Server Error"
            })
        }
    }
}