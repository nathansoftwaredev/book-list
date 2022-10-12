class Book {
    constructor(title, author, isbn){
        this.title = title
        this.author = author
        this.isbn = isbn
    }
}

class UI {
    addBookToList(book){
        const list = document.getElementById('book-list')
        const row = document.createElement('tr')
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
        `

        list.appendChild(row)
    }

    showAlert(message, className){
        const div = document.createElement('div')
        div.className = `alert ${className}`
        div.appendChild(document.createTextNode(message))

        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form')

        container.insertBefore(div, form) //Takes in what you want to insert, then what you want to insert it before.

        setTimeout(function(){
            document.querySelector('.alert').remove()
        }, 3000)
    }

    deleteBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove()
        }
    }

    clearFields(){
        document.getElementById('title').value = ''
        document.getElementById('author').value = ''
        document.getElementById('isbn').value = ''
    }
}


// Local Storage Class
class Store {
    static getBooks(){
        let books
        if(localStorage.getItem('books') === null){
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }

        return books
    }
    
    static displayBooks(){
        const books = Store.getBooks()

        books.forEach(function(book){
            const ui = new UI

            // Add book to UI
            ui.addBookToList(book)
        })
    }

    static addBook(book){
        const books = Store.getBooks()

        books.push(book)

        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(isbn){
        const books = Store.getBooks()

        books.forEach(function(book, index){
            if(book.isbn === isbn){
                books.splice(index, 1)
            }
        })

        localStorage.setItem('books', JSON.stringify(books))
    }

}




// Event Listeners
// Event listener for DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks)


// Event listener for add book
document.getElementById('book-form').addEventListener('submit', function(e){
    
    // Get form values
    const title = document.getElementById('title').value
    const author = document.getElementById('author').value
    const isbn = document.getElementById('isbn').value

    // Once we submit these we want to instantiate the book constructor.
    // Instaniate book
    const book = new Book(title, author, isbn)

    // Instantiate UI
    const ui = new UI()

    // Validate
    if(title === '' || author === '' || isbn === ''){
        ui.showAlert('Please fill in all fields', 'error')
    } else {
        // Add book to list
        ui.addBookToList(book)
        // Add to local storage
        Store.addBook(book)
        // Show success
        ui.showAlert('Book Added', 'success')
        // Clear fields
        ui.clearFields()
    }

 e.preventDefault()
})

// Event listener for delete
document.getElementById('book-list').addEventListener('click', function(e){

    // Instantiate UI
    const ui = new UI()
    // Delete Book
    ui.deleteBook(e.target)
    // Remove from local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
    // Show message
    ui.showAlert('Book Removed', 'success')

    e.preventDefault()
})