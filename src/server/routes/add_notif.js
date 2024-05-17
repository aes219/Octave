require("dotenv").config()

const { google } = require("googleapis")
const sheets = google.sheets({ version: 'v4' })
const creds = process.env.CREDS

module.exports = {
    route: "users/notifs",
    method: "PUT",
    run: async (req, res) => {
        const { email, notifs } = req.body;

        const auth = await google.auth.getClient({
            keyFile: creds,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
        const spreadsheetId = process.env.DATABASE_ID;
        try {
            const rowReq = {
                spreadsheetId,
                range: "Inboxes!A:B",
                auth,
            };
            const rowRes = await sheets.spreadsheets.values.get(rowReq);
            const rows = rowRes.data.values;
            const rowIndex = rows.findIndex((row) => row[0] === email);

            if (rowIndex !== -1) {
                const notifsIndex = rows[0].indexOf("notifications");
                const notifsColumn = String.fromCharCode(notifsIndex + 65);
                const notifsRange = `Inboxes!${notifsColumn}${rowIndex + 1}`;

                const notifUpdateRequest = {
                    auth,
                    spreadsheetId,
                    range: notifsRange,
                    valueInputOption: "RAW",
                    resource: {
                        values: [[JSON.stringify(notifs)]],
                    },
                };
                const response = await sheets.spreadsheets.values.update(notifUpdateRequest);
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
            console.log("Error adding notification: \n", e);
            res.status(500).send({
                status: 500,
                message: "Internal server error",
            });
        }
    },
};
