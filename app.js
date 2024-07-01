const express = require('express')
const books = require('./book')

const app = express();

app.use(express.json())
app.use(express.text());

app.get('/books', (req,res) => {
    if(books.length === 0) {
        res.status(204)
    }
    res.json(books)
})

app.get("/books/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const getBook = books.find((title) => title.id === id);
    if (!getBook) {
    res.status(204);
    }
    res.json(getBook);
});

app.post('/books', (req,res)=> {
    const id = new Date().getTime()
    let { title, author, year } = req.body

    title = title.trim();
    author = author.trim();

    if(typeof year === "string") {
        return res.status(400).send("El año debe ser un número")
    }

    if (!title || !author || !year) {
        return res.status(400).send("Datos faltantes")
    }

    const repeatBook = books.find((book) => book.title === title)
    if(repeatBook) {
        return res.status(401).send("Ya existe el libro")
    }

    books.push({
        id: id,
        title: title,
        author: author,
        year: +year
    })

    res.send('Libro creado correctamente')
})

app.put('/books/:id', (req,res)=>{
    const id = parseInt(req.params.id)

    const { title, author, year } = req.body;

    if(typeof year === "string") {
        return res.status(400).send("El año debe ser un número")
    }

    const bookIndex = books.findIndex((title) => title.id === id)

    if(bookIndex === -1) {
        return res.status(400).send("No existe el libro")
    }

    books[bookIndex].title = title.trim()
    books[bookIndex].author = author.trim()
    books[bookIndex].year = +year

    res.send('Se actualizaron los datos')
})


app.delete('/books/:id', (req,res) => {
    const id = parseInt(req.params.id)

    const getBook = books.findIndex((title) => title.id === id)

    if(getBook === -1) {
        return res.status(404).send('No existe el libro')
    } else {
        books.splice(getBook, 1);
        res.send('Libro eliminado')
    }

    
})


app.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'))

