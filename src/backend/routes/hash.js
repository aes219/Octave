module.exports = {
    route: 'hash',
    method: 'GET',
    run: async (req, res) => {
        try {
            const { string } = req.query

            const { createHash } = require('node:crypto');
            const hash = createHash('sha256');

            hash.on('readable', () => {
                const data = hash.read();
                if (data) {
                    res.status(200).json({
                        status: 200,
                        message: "OK",
                        valaue: data.toString('hex')
                    })
                }
            });

            hash.write(string);
            hash.end();
        } catch (e) {
            console.log(e)
            res.status(500).json({
                status: 500,
                message: "Internal Server Error"
            })
        }

    }
}