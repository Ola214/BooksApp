

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

  const favouriteBooks = [];

  class Book {
    constructor(id, data) {
      const thisBook = this;
      thisBook.id = id;
      thisBook.data = data;
      thisBook.render();
      thisBook.initActions();
    }

    initActions() {
      const book = this;

      const bookImg = book.element.querySelector('.book__image');

      bookImg.addEventListener('dblclick', (e) => {
        e.preventDefault();

        if(bookImg.classList.contains('favorite')){
          bookImg.classList.remove('favorite');

          const index = favouriteBooks.indexOf(bookImg.getAttribute('data-id'));

          if(index !== -1){
            favouriteBooks.splice(index, 1);
          }
        } else {
          bookImg.classList.add('favorite');
          favouriteBooks.push(bookImg.getAttribute('data-id'));
        }
      });

    }

    render() {
      const thisBook = this;

      const generatedHTML = templates.book(thisBook.data);

      thisBook.element = utils.createDOMFromHTML(generatedHTML);

      const bookContainer = document.querySelector(select.all.booksList);

      bookContainer.appendChild(thisBook.element);
    }
  }

  const app = {
    initMenu: function() {
      const thisApp = this;

      for(let bookData in thisApp.data.books) {
        new Book(thisApp.data.books[bookData].id, thisApp.data.books[bookData]);
      }
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