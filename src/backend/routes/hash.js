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
                    res.status(200).send(data.toString('hex'))
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