require("dotenv").config();

const { google } = require("googleapis");

const path = require("path") 
const creds = path.join(process.cwd(), 'credentials.json');
;

const sheetId = process.env.DATABASE_ID;

module.exports = {
    route: "users/notifs",
    method: "DELETE",
    run: async (req, res) => {
        const { email, notif } = req.query;

        try {
            const auth = await google.auth.getClient({
                keyFile: creds,
                scopes: ["https://www.googleapis.com/auth/spreadsheets"],
            });

            const sheets = google.sheets({ version: "v4" });

            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: sheetId,
                range: "Inboxes!A:Z",
                key: process.env.API_KEY
            });

            const rows = response.data.values;

            if (rows.length) {
                const headers = rows[0];
                const emailIndex = headers.indexOf("email");
                const notifsIndex = headers.indexOf("notifications");

                if (emailIndex !== -1 && notifsIndex !== -1) {
                    const emailRow = rows.find((row) => row[emailIndex] === email);

                    if (emailRow) {
                        let notifs = JSON.parse(emailRow[notifsIndex]);
                        notifs = notifs.filter((n) => n !== notif);
                        emailRow[notifsIndex] = JSON.stringify(notifs);

                        await sheets.spreadsheets.values.update({
                            auth,
                            spreadsheetId: sheetId,
                            range: `Inboxes!A${rows.indexOf(emailRow) + 1}:B${rows.indexOf(emailRow) + 1
                                }`,
                            valueInputOption: "RAW",
                            requestBody: { values: [emailRow] },
                        });

                        return res.status(200).send("Notification removed successfully.");
                    }
                }
            }

            return res.status(404).send("Invalid email or notif.");
        } catch (error) {
            console.error("Error removing friend:", error);
            return res.status(500).send("Internal Server Error");
        }
    },
};
