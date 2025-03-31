require("dotenv").config();
const { google } = require("googleapis");
const sheets = google.sheets({ version: "v4" });
const path = require("path") 
const creds = path.join(process.cwd(), 'credentials.json');

module.exports = {
  route: "users/profile",
  method: "PUT",
  run: async (req, res) => {
    const { email, nickname, bio } = req.query;
    const auth = await google.auth.getClient({
      keyFile: creds,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const spreadsheetId = process.env.SHEET_ID;

    try {
      const rowReq = {
        spreadsheetId,
        range: "Profiles!A:C",
        auth,
      };
      const rowRes = await sheets.spreadsheets.values.get(rowReq);
      const rows = rowRes.data.values;
      const rowIndex = rows.findIndex((row) => row[0] === email);

      const nickIndex = rows[0].indexOf("nickname");
      const nickColumn = String.fromCharCode(nickIndex + 65);
      const nickRange = `Profiles!${nickColumn}${rowIndex + 1}`;

      const bioIndex = rows[0].indexOf("bio");
      const bioColumn = String.fromCharCode(bioIndex + 65);
      const bioRange = `Profiles!${bioColumn}${rowIndex + 1}`;

      const nickUpdateRequest = {
        auth,
        spreadsheetId,
        range: nickRange,
        valueInputOption: "RAW",
        resource: {
          values: [[nickname]],
        },
      };
      const bioUpdateRequest = {
        auth,
        spreadsheetId,
        range: bioRange,
        valueInputOption: "RAW",
        resource: {
          values: [[bio]],
        },
      };
      const response = await sheets.spreadsheets.values.update(
        nickUpdateRequest
      );
      const response2 = await sheets.spreadsheets.values.update(
        bioUpdateRequest
      );

      res.status(200).send({ response, response2 });
    } catch (e) {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
      console.log(e);
    }
  },
};
