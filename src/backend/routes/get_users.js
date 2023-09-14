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
                res.send(Data);
            })
            .catch((error) => {
                console.log(error);
            })
    }
}