const axios = require('axios')

module.exports = {
    route: "users/notifs",
    method: "GET",
    run: async (req, res) => {
        const { email } = req.query

        axios.get(require("../api")("Inboxes"))
            .then((response) => {
                const [headerRow, ...rows] = response.data.values

                const Data = rows.map(row => {
                    const obj = {};
                    headerRow.forEach((key, index) => {
                        obj[key] = row[index];
                    });
                    return obj;
                });

                const result = Data.filter(user => user.email === email)

                res.status(200).json({
                    status: 200,
                    message: "OK",
                    values: result
                });
            })
            .catch((e) => {
                console.log("Error fetching notifs:\n", e)
                res.status(500).send({
                    status: 500,
                    message: "Internal Server Error"
                })
            })
    }
}