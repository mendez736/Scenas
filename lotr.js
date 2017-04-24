


function Book(title, sinopse, img, link, isbn) {


	this.likes = 0;
	this.dislikes = 0;
	this.title = title;
	this.sinopse = sinopse;
	this.img = img;
	this.link = link;
	this.isbn = isbn;
	this.shelf;

	this.like = function () {

		this.likes++;

	}

	this.dislike = function () {

		this.dislikes++;

	}

	this.render = function(id){

		$("#" + id + " .title").html(this.title); // XXXXXXX

		$("#" + id + " .sinopse").html(this.sinopse); // XXXXXXX

		$("#" + id + " .img").attr('src', this.img);

		$("#" + id + " .isbn").html("ISBN: " + this.isbn); // XXXXXXX

		$("#" + id + " .link").attr('href', this.link); // Array de links

		$("#" + id + " .likecounter").html("Likes: " + this.likes); 

		$("#" + id + " .dislikecounter").html("Dislikes: " + this.dislikes);

		var idLike = "#" + id + " .like"; 
		var idDislike = "#" + id + " .dislike";
		var data = {"book":this,"id":id};

		$(idLike).off('click');
		$(idDislike).off('click');


		$(idLike).click(data, function(event) {

			event.data.book.like();
			event.data.book.render(event.data.id);
			//event.preventDefault();
		});


		$(idDislike).click(data, function(event) {

			event.data.book.dislike();
			event.data.book.render(event.data.id);
			//event.preventDefault();
		});

		
		var idNext = "#" + id + " .next";
		$(idNext).off('click');

		$(idNext).click(data, function(event) {

			
			event.data.book.shelf.switch(event.data.id);
			//event.preventDefault();
		});

	}

}



function Queue() {


	this.data = []; // data = atributo porque é uma variavel criada dentro da funcao

	this.enqueue = function(element) {  // Element = parametro porque é o que a funcao vai receber

		this.data.push(element);

	}


	this.dequeue = function() {  // "this" e para utilizar dentro de classes

		var aux = this.data[0] // Usar "var" para criar variaveis dentro de metodos.

		this.data = this.data.slice(1, this.data.length);

		return aux;

	}


}




function Bookshelf() {

	this.shelf = new Queue(); // Criacao da prateleira



	this.addBook = function(book) {    // Funcao para meter um livro na prateleira

		this.shelf.enqueue(book);

		book.shelf = this;

	}




	this.init = function() {


		var i =	this.shelf.dequeue();
		i.render("b1");
		i =	this.shelf.dequeue();
		i.render("b2");
		i =	this.shelf.dequeue();
		i.render("b3");
	

	}

	this.switch = function (colmun) {

		var s =	this.shelf.dequeue();
		s.render(colmun);

	}

	

	this.load = function(url) {

		//var url = "https://www.googleapis.com/books/v1/volumes?q=harry+potter";
		var parse = this

		$.get(url)
			.done(function(data) {




				parse.parseBooks(data);


			})


			.fail(function(data) {

				console.log("Error: " + data);

			})


	}
	
	

	this.parseBooks = function(data) {

		


		for (i = 0; i < data.items.length ; i++ ) {
			console.log(data);
			var title = data.items[i].volumeInfo.title;
			var desc = data.items[i].volumeInfo.description;
			var img = data.items[i].volumeInfo.imageLinks.thumbnail;
			//var isbn = data.items[i].volumeInfo.industryIdentifiers[0].identifier;	
			var link = data.items[i].volumeInfo.canonicalVolumeLink;
			var bookN = new Book(title, desc, img, link, "isbn");
			this.addBook(bookN);


		}

		this.init();

	}

}



var bs = new Bookshelf();   // Criacao de variavel para adicionar conteudo ao array


		
var value = $("#search").val();

$("#search").click(function(event) {

	bs.load("https://www.googleapis.com/books/v1/volumes?q=" + value);

});

bs.load("https://www.googleapis.com/books/v1/volumes?q=harry+potter");



