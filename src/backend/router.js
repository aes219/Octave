const { readdirSync } = require("fs")
const { join } = require('path')
const chalk = require("chalk")

module.exports = (app) => {
    const dir = join(__dirname, 'routes')
    readdirSync(dir).forEach((file) => {
        const endpoint = file.substring(0, file.indexOf('.'))
        const router = require('./routes/' + endpoint)
        switch (router.method) {
            case 'GET':
                app.get(`/${router.route}`, (req, res) => {
                    router.run(req, res)
                })
                console.log(`${chalk.yellow('[ BACKEND ]')} ${chalk.cyan(`[ ROUTER ]`)} ${chalk.green(`Loaded ${router.method} /${router.route}`)}`)
                break;
            case 'POST':
                app.post(`/${router.route}`, (req, res) => {
                    router.run(req, res)
                })
                console.log(`${chalk.yellow('[ BACKEND ]')} ${chalk.cyan(`[ ROUTER ]`)} ${chalk.green(`Loaded ${router.method} /${router.route}`)}`)
                break;
            case 'PUT':
                app.put(`/${router.route}`, (req, res) => {
                    router.run(req, res)
                })
                console.log(`${chalk.yellow('[ BACKEND ]')} ${chalk.cyan(`[ ROUTER ]`)} ${chalk.green(`Loaded ${router.method} /${router.route}`)}`)
                break;
            case 'DELETE':
                app.delete(`/${router.route}`, (req, res) => {
                    router.run(req, res)
                })
                console.log(`${chalk.yellow('[ BACKEND ]')} ${chalk.cyan(`[ ROUTER ]`)} ${chalk.green(`Loaded ${router.method} /${router.route}`)}`)
                break;

            default:
                console.log(`${chalk.yellow(`[ BACKEND ]`)} ${chalk.red(`[ ERROR ]`)} ${chalk.redBright(`Invalid Method at /${router.route}`)}`)
                break;
        }
    })
}