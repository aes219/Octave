module.exports = {
    route: "test",
    method: 'GET',
    run: async(req, res) => {
        res.send("Hello World!");
    }
}