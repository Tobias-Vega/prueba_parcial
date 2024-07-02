const express = require('express');
const books = require('./db')

const app = express();

app.use(express.json())
app.use(express.text())

app.get('/books', (req,res) => {
    if(books.length === 0) {
        return res.status(204).send()
    }
    res.json(books)
})

app.get('/books/:id', (req,res) => {
    const id = parseInt(req.params.id)

    const getBook = books.find((book)=> book.id === id)

    if (!getBook) {
        return res.status(404).send('el libro no existe')
    }

    res.json(getBook)
})

app.post('/books', (req,res) => {
    const generarId = new Date().getTime()

    let { title, author, year } = req.body

    title = title.trim();
    author = author.trim()
    year = parseInt(year)

    if(Number.isNaN(year)) {
        return res.status(400).send('El año debe ser un número')
    }

    if (!title || !author || !year) {
        return res.status(400).send('Datos faltantes')
    }

    const repeatBook = books.find((book) => book.title === title)
    if(repeatBook) {
        return res.status(401).send('Ya existe el libro')
    }

    books.push({
        id: generarId,
        title: title,
        author: author,
        year: +year
    })

    res.send('Libro creado correctamente')
})

app.put('/books/:id', (req,res) => {
    const id = parseInt(req.params.id)

    const { title, author, year } = req.body

    if(typeof year === "string") {
        return res.status(400).send('El año debe ser un número')
    }

    const indexBook = books.findIndex((book) => book.id === id)

    if(indexBook === -1) {
        return res.status(400).send('No existe el libro')
    }

    books[indexBook].title = title.trim()
    books[indexBook].author = author.trim()
    books[indexBook].year = parseInt(year)

    res.send('Se actualizaron los datos')
})

app.delete('/books/:id', (req,res) => {
    const id = parseInt(req.params.id)

    const getBook = books.findIndex((book) => book.id === id)

    if(getBook === -1) {
        return res.status(404).send('No existe el libro')
    } else {
        books.splice(getBook, 1)
        res.send('libro eliminado')
    }
})

app.listen(3000, ()=> console.log("Servidor corriendo"))