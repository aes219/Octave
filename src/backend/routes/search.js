const axios = require('axios')

module.exports = {
    route: 'search',
    method: 'GET',
    run: async (req, res) => {
        const { email } = req.query;
        axios.get(require('../api')('Accounts'))
            .then((response) => {
                const [headerRow, ...rows] = response.data.values;

                const Data = rows.map(row => {
                    const obj = {};
                    headerRow.forEach((key, index) => {
                        obj[key] = row[index];
                    });
                    return obj;
                });
                const result = Data.filter(user => user.email === email)
                res.status(200).json(result)
            })
            .catch((e) => {
                console.log(e);
                res.status(500).json({
                    status: 500,
                    message: "Internal Server Error"
                })
            })
    }
}