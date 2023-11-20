require('dotenv').config()
const { google } = require('googleapis');
const sheets = google.sheets({ version: 'v4' })
const creds = './credentials.json'

module.exports = {
    route: 'users/profiles',
    method: 'POST',
    run: async (req, res) => {
        try {
            const { email, name, bio, pfp } = req.query
            const auth = await google.auth.getClient({
                keyFile: creds,
                scopes: ['https://www.googleapis.com/auth/spreadsheets']
            });

            const resource = {
                values: [[email, name, bio, pfp]],
            };
            const spreadsheetId = process.env.DATABASE_ID
            const range = 'Accounts!A:E'

           const response = await sheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range,
                valueInputOption: 'USER_ENTERED',
                resource,
            })

                console.log('Done', JSON.stringify(response))

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