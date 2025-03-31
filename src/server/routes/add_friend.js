require("dotenv").config()

const { google } = require("googleapis")
const sheets = google.sheets({ version: 'v4' })
const path = require("path") 
const creds = path.join(process.cwd(), 'credentials.json');


module.exports = {
    route: "users/profile/friends",
    method: "PUT",
    run: async (req, res) => {
        const { email } = req.query;
        const friends = JSON.parse(req.query.friends);

        const auth = await google.auth.getClient({
            keyFile: creds,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
        const spreadsheetId = process.env.SHEET_ID;
        try {
            const rowReq = {
                spreadsheetId,
                range: "Profiles!A:D",
                auth,
            };
            const rowRes = await sheets.spreadsheets.values.get(rowReq);
            const rows = rowRes.data.values;
            const rowIndex = rows.findIndex((row) => row[0] === email);

            if (rowIndex !== -1) {
                const frndsIndex = rows[0].indexOf("friends");
                const frndsColumn = String.fromCharCode(frndsIndex + 65);
                const frndsRange = `Profiles!${frndsColumn}${rowIndex + 1}`;

                const frndsUpdateRequest = {
                    auth,
                    spreadsheetId,
                    range: frndsRange,
                    valueInputOption: "RAW",
                    resource: {
                        values: [[JSON.stringify(friends)]],
                    },
                };
                const response = await sheets.spreadsheets.values.update(frndsUpdateRequest);
                res.status(200).send({
                    status: 200,
                    message: "OK",
                    response: response,
                });
            } else {
                res.status(404).send({
                    status: 404,
                    message: "User not found",
                });
            }
        } catch (e) {
            console.log("Error adding friend: \n", e);
            res.status(500).send({
                status: 500,
                message: "Internal server error",
            });
        }
    },
};
