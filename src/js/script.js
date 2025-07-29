

{
  'use strict';

  const select = {
    templateOf: {
      book: '#template-book',
    },
    all: {
      booksList: '.books-list',
    }
  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };

  const settings = {
    db: {
      url: '//localhost:3131',
      books: 'books'
    }
  };

  class Book {
    constructor(id, data) {
      const thisBook = this;
      thisBook.id = id;
      thisBook.data = data;
      thisBook.render();
    }

    render() {
      const thisBook = this;

      const generatedHTML = templates.book(thisBook.data);

      thisBook.element = utils.createDOMFromHTML(generatedHTML);

      const bookContainer = document.querySelector(select.all.booksList);

      bookContainer.appendChild(thisBook.element);
    }
  }

  class Books {

    constructor(books) {
      const thisBooks = this;
      thisBooks.books = books;
      thisBooks.favouriteBooks = [];

      thisBooks.initActions();
    }

    initActions() {
      const booksList = document.querySelector('.books-list');

      booksList.addEventListener('dblclick', (e) => {
        e.preventDefault();

        const bookImage = e.target.offsetParent;

        console.log('bookImage', bookImage);

        if(bookImage.classList.contains('book__image')){ //offsetParent odwołanie do elementu, który jest najbliższym elementem przodka o określonej pozycji
          if(bookImage.classList.contains('favorite')){
            bookImage.classList.remove('favorite');

            const index = this.favouriteBooks.indexOf(bookImage.getAttribute('data-id'));

            if(index !== -1){
              this.favouriteBooks.splice(index, 1);
            }
          } else {
            bookImage.classList.add('favorite');
            this.favouriteBooks.push(bookImage.getAttribute('data-id'));
          }
        }
      });
    }
  }


  const app = {
    initMenu: function() {
      const thisApp = this;

      const bookList = [];

      for(let bookData in thisApp.data.books) {
        bookList.push(new Book(thisApp.data.books[bookData].id, thisApp.data.books[bookData]));
      }
      new Books(bookList);
    },
    initData: function() {
      const thisApp = this;
      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.books;

      fetch(url)
        .then(function(rawRespionse){
          return rawRespionse.json();
        })
        .then(function(parseResponse){
          thisApp.data.books = parseResponse;
          thisApp.initMenu();
        });
    },
    init: function() {
      const thisApp = this;
      thisApp.initData();
    }
  };

  app.init();

}