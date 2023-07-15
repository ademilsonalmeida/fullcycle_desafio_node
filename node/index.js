const express = require('express')
const mysql = require('mysql')

const app = express()
const port = 3000

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
}

const connection = mysql.createConnection(config)

app.get('/', async (req, res) => {
    let results = '<h1>Full Cycle Rocks!</h1>'
    try {
        await addPerson('Bruce Wayne')
        await addPerson('Tony Stark')

        var people = showPeople(await getPeople())
        results += people

        res.send(results)        
    } catch (error) {
        console.log(error)
    }        
})

app.listen(port, () => {
    console.log('Listen in the port ' + port)

    const createTable = `
        CREATE TABLE IF NOT EXISTS people (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(50), PRIMARY KEY (id));
    `;
    connection.query(createTable)
})

addPerson = (person) => {
    return new Promise((resolve, reject) => {        
        const sql = `INSERT INTO people(name) VALUES('${person}')`
        connection.query(sql, (error, results) => {
            if (error)
                return reject(error)

            return resolve(results)
        })
    })          
}

getPeople = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id, name FROM people`
        connection.query(sql, (error, results) => {
            if (error)
                return reject(error)
            
            return resolve(results)
        })
    })
}

showPeople = (people) => {
    if (!people)
        return '<h2>The list of people is empty</h2>'

    let result = '<ul>'

    people.map(person => {
        result += `<li>${person.id} - ${person.name}</li>`
    })

    result += '</ul>'

    return result
}