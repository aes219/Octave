const axios = require('axios')

module.exports = {
    route: 'search',
    method: 'GET',
    run: async (req, res) => {
        const {email} = req.query;
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
                const result = Data.filter(user => user.email === email)
                res.status(200).json(result)
            })
            .catch((error) => {
                console.log(error);
            })
    }
}