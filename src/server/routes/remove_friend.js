require("dotenv").config();

const { google } = require("googleapis");

const path = require("path") 
const creds = path.join(process.cwd(), 'credentials.json');
;

const sheetId = process.env.DATABASE_ID;

module.exports = {
  route: "users/profile/friends",
  method: "DELETE",
  run: async (req, res) => {
    const { email, friend } = req.query;

    try {
      const auth = await google.auth.getClient({
        keyFile: creds,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      const sheets = google.sheets({ version: "v4" });

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: "Profiles!A:D",
        key: process.env.API_KEY
      });

      const rows = response.data.values;

      if (rows.length) {
        const headers = rows[0];
        const emailIndex = headers.indexOf("email");
        const friendsIndex = headers.indexOf("friends");

        if (emailIndex !== -1 && friendsIndex !== -1) {
          const emailRow = rows.find((row) => row[emailIndex] === email);

          if (emailRow) {
            let friends = JSON.parse(emailRow[friendsIndex]);
            friends = friends.filter((f) => f !== friend);
            emailRow[friendsIndex] = JSON.stringify(friends);

            await sheets.spreadsheets.values.update({
              auth,
              spreadsheetId: sheetId,
              range: `Profiles!A${rows.indexOf(emailRow) + 1}:D${rows.indexOf(emailRow) + 1
                }`,
              valueInputOption: "RAW",
              requestBody: { values: [emailRow] },
            });

            return res.status(200).send("Friend removed successfully.");
          }
        }
      }

      return res.status(404).send("Invalid email or friend.");
    } catch (error) {
      console.error("Error removing friend:", error);
      return res.status(500).send("Internal Server Error");
    }
  },
};
