const express = require('express')
const fs = require('fs/promises')
require('dotenv').config()

const PORT = process.env.PORT || 3000

const app = express()

let contacts = []
let nextId = 0

// fs.readFile('./data', 'utf-8', (err, data) => {
//     if (err) throw err

//     contacts = JSON.parse(data)
// })

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // resolve('hello')
            reject('pogresno nesto')
        }, ms)
    })
}


async function delayAsync(ms) {
    return 'blabla'
}

const todo = {
    id: 12123,
    title: 'adsfasdf',
    status: false,
    date: Date()
}


// get /todos -> sve todoove
// get /todos/:id -> jedan todo
// post /todos -> kreira todo (stavlja status na false)
// patch /todos/:id -> updatuje todo osim id (id ostaje nepromenjen)
// delete /todos/:id -> brise todo
// get /todos/finished -> vraca samo zavrsene (sa statusom true)
// get /todos/pendings -> vraca samo nezavrsene (sa statusom false)
// get /todos/incoming -> vraca sve todoove koji imaju date koji je u buducnosti



app.use(express.json())

app.get('/bla', async (req, res) => {
    try {
        let msg = await delay(3000)
        console.log(msg)
    } catch (e) {
        console.error(e)
    }

    try {
        const data = await fs.readFile('./data', 'utf-8')
        contacts = JSON.stringify(data)
    } catch (err) {
        console.log(err)
    }
})

app.get('/contacts', (req, res) => {
    res.json(contacts)
})

app.get('/contacts/:id', (req, res) => {
    let { id } = req.params  
    id = +id
    if (isNaN(id)) {
        return res.status(400).json({ message: 'id should be a number' })
    }

    const contact = contacts.find(c => c.id === id)
    if (contact) {
        return res.status(200).json(contact)
    } else {
        return res.status(404).end()
    }

})

app.post('/contacts', (req, res) => {
    const contact = req.body
    if (!contact.name || !contact.lastName) {
        return res.status(400).json({ message: 'You must provide name and lastName' })
    }

    contact.id = nextId++
    contacts.push(contact)
    res.status(201).json(contact)
})

app.patch('/contacts/:id', (req, res) => {
    let { id } = req.params  
    id = +id
    if (isNaN(id)) {
        return res.status(400).json({ message: 'id should be a number' })
    }

    const index = contacts.findIndex(c => c.id === id)
    const contact = contacts[index]

    if (!contact) {
        return res.status(404).end()
    }

    const newContact = req.body
    contacts[index] = { ...contact, ...newContact, id: contact.id }
    res.status(204).end()
})

app.delete('/contacts/:id', (req, res) => {
    let { id } = req.params
    id = +id

    if (isNaN(id)) {
        return res.status(400).json({ message: 'id should be number' })
    }

    contacts = contacts.filter(c => c.id !== id)
    res.status(204).end()
})

app.get('/hello', (req, res) => {
    res.json({ message: 'hello' })
})

app.listen(PORT, () => {
    console.log(`listening on localhost:${PORT}`)
})