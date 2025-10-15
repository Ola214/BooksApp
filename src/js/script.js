

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
      thisBooks.filters = [];

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

      const filters = document.querySelectorAll('.filters');


      for(let i = 0; i < 2; i++) {


        filters[0].children[0].children[i].addEventListener('click', (e) => {
          this.filters = [];
          const check = e.target;


          if(
            (check.getAttribute('type') == 'checkbox') &&
            (check.getAttribute('name') == 'filter')
          )
          {

            if(check.checked == 1) {
              this.filters.push(check.getAttribute('value'));
            }

            if(check.checked != 1){

              const index = this.filters.indexOf(check.getAttribute('value'));

              if(index !== -1){
                this.filters.splice(index, 1);
              }
            }
          }
          this.check = check;
          this.filterBooks();


        });
      }
    }

    filterBooks() {
      const books = this.books; //wszystkie książki

      for(let bookId in books) { //każdy index książki
        const book = books[bookId]; //pojedyncza książka z kolekcji wszystkich książek


        const isBookInThisFilter = book.data.details[this.check.getAttribute('value')]; // czy książka ma filtr taki jak kliknięty w filtrach, nie ważne, czy na true, czy na false

        if(isBookInThisFilter) { // jeżeli książka ma filtr taki jak kliknięty w filtrach, nie ważne ,czy na true, czy na false

          if(book.element.children[1].classList.contains('hidden')) { //jeżeli  ma klasę hidden to usuń ją, będzie niewyszarzone +checkbox
            book.element.children[1].classList.remove('hidden'); //niewyszarzone +checkbox
          }
          else { //jeżeli nie ma klasy hidden to dodaj ją, będzie wyszarzone +checkbox
            book.element.children[1].classList.add('hidden'); // wyszarzone +checkbox
          }
        }
      }

    }

  }

  class BooksList {
    constructor() {
      const thisApp = this;
      thisApp.initData();
    }

    initMenu() {
      const thisApp = this;

      const bookList = [];

      for(let bookData in thisApp.data.books) {
        bookList.push(new Book(thisApp.data.books[bookData].id, thisApp.data.books[bookData]));
      }
      new Books(bookList);
    }

    initData() {
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
    }
  }

  new BooksList();

}