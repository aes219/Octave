const axios = require('axios')

module.exports = {
    route: 'users',
    method: 'GET',
    run: async (req, res) => {
        axios.get(require('../api')('Users'))
            .then((response) => {
                const [headerRow, ...rows] = response.data.values;

                const Data = rows.map(row => {
                    const obj = {};
                    headerRow.forEach((key, index) => {
                        obj[key] = row[index];
                    });
                    return obj;
                });
                res.status(200).json({
                    status: 200,
                    message: "OK",
                    value: Data
                });
            })
            .catch((e) => {
                console.log(e)
                res.status(500).json({
                    status: 500,
                    message: "Internal Server Error"
                })
            })
    }
}