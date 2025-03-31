require('dotenv').config()
const { google } = require('googleapis');
const sheets = google.sheets({ version: 'v4' })
const path = require("path") 
const creds = path.join(process.cwd(), 'credentials.json');

module.exports = {
    route: 'users/update',
    method: 'PUT',
    run: async (req, res) => {
        const { email, key, value } = req.query
        const auth = await google.auth.getClient({
            keyFile: creds,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        })
        const spreadsheetId = process.env.SHEET_ID

        try {
            const rowReq = {
                spreadsheetId,
                range: 'Accounts!A:Z',
                auth
            }
            const rowRes = await sheets.spreadsheets.values.get(rowReq)
            const rows = rowRes.data.values
            const rowIndex = rows.findIndex(row => row[0] === email)
            const keyIndex = rows[0].indexOf(key)
            const column = String.fromCharCode(keyIndex + 65)
            const range = `Accounts!${column}${rowIndex + 1}`
            const updateRequest = {
                auth,
                spreadsheetId,
                range,
                valueInputOption: 'RAW',
                resource: {
                    range,
                    values: [[value]],
                },
            }
            const response = await sheets.spreadsheets.values.update(updateRequest)
            res.status(200).send(response)
        } catch (e) {
            res.status(500).json({
                status: 500,
                message: "Internal Server Error"
            })
            console.log(e)
        }
    }
}