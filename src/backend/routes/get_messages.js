const axios = require('axios')

module.exports = {
    route: "users/messages",
    method: 'GET',
    run: async(req, res) => {
        const { client, recipient } = req.query
        axios.get(require('../api')('Messages'))
            .then((response) => {
                const [headerRow, ...rows] = response.data.values;

                const Data = rows.map(row => {
                    const obj = {};
                    headerRow.forEach((key, index) => {
                        obj[key] = row[index]
                    })
                    
                    return obj
                })

                const result = Data.filter(entry =>
                (entry.client == client && entry.recipient == recipient)
                    ||
                (entry.client == recipient && entry.recipient == client)
                )

                // console.log(result)
                res.send(result)
            })
    }
}