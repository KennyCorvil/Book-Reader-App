let gutendexBaseUrl = "https://gutendex.com/books?search=",
    corsBaseUrl ="https://corsproxy-reader.herokuapp.com/",
    corpusSubjectListUrl = "http://corpus-db.org/api/subjects",
    subjectByNameBase = "http://corpus-db.org/api/subject/";

let file, booklet, aBook, bookId, uploadModalOn = false, subjectName;

const bookDragDrop = document.querySelector(".drag-area"),//
      bookUploadBtn = document.querySelector(".book-upload"),// button to search and select file
      bookInput = document.querySelector(".bookInput"),
      searchBookInput = document.querySelector(".searchBookInput"),
      searchBookBtn = document.querySelector(".search-btn"),
      bookList = document.querySelector(".bookList"),
      loadingGrid = document.querySelector(".lds-grid"),
      openUploadModal = document.querySelector(".open-upload-btn"),
      closeUploadModal = document.querySelector(".closeUpload"),
      uploadModal = document.querySelectorAll(".uploadModal"),
      bookSubjects = document.querySelector(".randomSubjects"),
      buttonRight = document.querySelector('.slideRight'),
      buttonLeft = document.querySelector('.slideLeft'),
      refreshSubjects = document.querySelector(".refreshSubjects");





const bookData = {}, 
      bookAuthorInfo = {};


const openCloseUpload = () => {
    uploadModal.forEach(el => {
        uploadModalOn?el.style.display ="flex":el.style.display ="none";
    })
}

openUploadModal.onclick = () => {
    uploadModalOn = !uploadModalOn;
    openCloseUpload();

}
closeUploadModal.onclick = () => {
    uploadModalOn = false;
    openCloseUpload();

}

searchBookBtn.onclick = () => {
    searchForBook();
}

const searchForBook = () => {
    let bookToSearch = searchBookInput.value;

    if(bookToSearch !== ""){

        //will clear out the book list to append the newly searched and found ones
        document.querySelectorAll(".bookListItems").forEach(el => el.remove());

        loadingGrid.style.display = "inline-block";


        fetch(gutendexBaseUrl+bookToSearch)
        .then(response => response.json())
        .then(data => data.results.map(item => {
            aBook = document.createElement("div");
            const bookDescr = document.createElement("div");
            const bookImage = document.createElement("img");
            const bookAuthor = document.createElement("div");
            const bookTitle = document.createElement("div");
            const subjectsCont = document.createElement("div");

            aBook.setAttribute("id", `${item.id}`);
            bookDescr.setAttribute("id", `${item.id}`);
            bookImage.setAttribute("id", `${item.id}`);
            bookAuthor.setAttribute("id", `${item.id}bookAuthor`);
            bookTitle.setAttribute("id", ` ${item.id}bookTitle`);
            subjectsCont.setAttribute("id", ` ${item.id}subjectsCont`);

            //console.log(item.formats["text/html"])

            //some times the book link is different
            if(item.formats["text/html"].indexOf("https://www.gutenberg.org/ebooks") > -1 ){//this basically determine if this base path exist
                bookData[item.id] = `https://www.gutenberg.org/cache/epub/${item.id}/pg${item.id}-images.html`;
                //console.log(bookLink)
            }else{
                bookData[item.id] = item.formats["text/html"];
            }
            //bookAuthorInfo[item.id] = item.authors;
            //console.log(bookAuthorInfo)

            aBook.setAttribute("class", "bookListItems");
            bookDescr.setAttribute("class", "bookDescr");
            bookAuthor.setAttribute("class", "bookAuth");
            bookTitle.setAttribute("class", "bookTitle");
            subjectsCont.setAttribute("class", "subjectsCont");

            bookDescr.addEventListener("click", bookClicked);
            bookImage.addEventListener("click", bookClicked);
            aBook.addEventListener("click", bookClicked);
            bookAuthor.addEventListener("click", bookClicked2);
            bookTitle.addEventListener("click", bookClicked2);
            subjectsCont.addEventListener("click", bookClicked2);

            bookImage.src = item.formats["image/jpeg"].replace("small.jpg", "medium.jpg");//making sure the highest quality image is rendered
            //console.log(bookImage.src)


            item.authors.map(res => {
                bookAuthor.innerText = res.name;
                searchAuthor(res.name);
            })
            bookTitle.innerText = item.title;
            
            bookDescr.appendChild(bookAuthor);
            bookDescr.appendChild(bookTitle);
            aBook.appendChild(bookImage);

            
            if(item.subjects.length >= 1){
                item.subjects.forEach(el => {
                    const subject = document.createElement("span");

                    subject.innerText = el;
                    subjectsCont.appendChild(subject);
                })
            }
            bookDescr.appendChild(subjectsCont);
            aBook.appendChild(bookDescr);
            bookList.appendChild(aBook);
            if(aBook !== null ){
                loadingGrid.style.display = "none";
            }

        })
        )

    }
    // fetch("https://cors-anywhere.herokuapp.com/https://www.gutenberg.org/files/3300/3300-h/3300-h.html")
    // .then(response => response.text())
    // .then(data => console.log(data))

}

bookUploadBtn.onclick = () => {
    bookInput.click(); //input will be clicked when user click on button
}
bookInput.addEventListener("change", chooseBook);

function chooseBook(){
    file = this.files[0];
    displayBook();
    window.open("./bookDisplay.html","_self");
    bookDragDrop.classList.add("active");
}

    //when user drags file over upload area
bookDragDrop.addEventListener("dragover", (event)=>{
    event.preventDefault(); // file will not open in a new tab
    bookDragDrop.classList.add("active");
});

//when file is dragged out of the area
bookDragDrop.addEventListener("dragleave", ()=>{
    bookDragDrop.classList.remove("active");
});

//when file is droped in the area
bookDragDrop.addEventListener("drop", (event)=>{
    event.preventDefault(); // file will not open in a new tab
    //assign  file drop to the global letiable
    file = event.dataTransfer.files[0];//[0] is for incase the user selects and drop multiple we will take the one at index 0
    displayBook();
});


function displayBook() {
    //delete the previous file
    //localStorage.removeItem("bookData");
    //so far we will only accept html text files
    let fileType = file.type;
    let validExtension = "text/html"
    //validates file type
    if (fileType === validExtension){
        let fileReader = new FileReader(); //creating new file object
        fileReader.onload = () =>{
            let fileURL = fileReader.result; //passing the file

            bookDragDrop.style.display = "none";
            bookDragDrop.style.transform = "scale(0)";

            //fetch the file and pass the data to the book letiable
            fetch(fileURL)
            .then(response => response.text())
            .then(data => {
                
                localStorage.setItem("bookData", data)
            });
        }
        fileReader.readAsDataURL(file);
    }else{
        alert("we only accept html files");
        bookDragDrop.classList.remove("active");
    }


}
function displayBook2() {
    //console.log(file);
    //fetch the file and pass the data to the book letiable
    fetch(corsBaseUrl+file)//add something to clear the bookData Object
    .then(response => response.text())
    .then(data => {
        //console.log(data)
        localStorage.setItem("bookData", data);
        localStorage.setItem("bookId", bookId);
        window.open("./bookDisplay.html","_self");

    });
}


function bookClicked(event) {
    bookId = String(event.target.id);
    file = bookData[bookId];
    displayBook2();

}
function bookClicked2(event) {
    bookId = parseInt(event.target.id);
    bookId = String(bookId);
    file = bookData[bookId];
    displayBook2();

}

//when Enter key is pressed from the keyboard
searchBookInput.addEventListener("keypress", function(event) {


    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      searchBookBtn.click();
    }
  });


  const randomSubjects = () => {
    let randomNum = Array.from({length: 100}, () => Math.floor(Math.random() * 26558));
    document.querySelectorAll(".subjectBtn").forEach(el => el.remove());

    fetch(corsBaseUrl+corpusSubjectListUrl)
    .then(response => response.json())
    .then(data => {
        for(let i =0; i<100; i++){
            const subjectBtn = document.createElement("button");
            subjectBtn.setAttribute("class", "subjectBtn");
            subjectBtn.setAttribute("id", data[randomNum[i]][1]);
            subjectBtn.innerText = data[randomNum[i]][0];
            bookSubjects.appendChild(subjectBtn);
            subjectBtn.addEventListener("click", clickBookSubject);
            //console.log(data[randomNum[i]][1])
        }
    })
  }

randomSubjects();

buttonRight.onclick = function () {
    bookSubjects.scrollLeft += 100;
  };
buttonLeft.onclick = function () {
    bookSubjects.scrollLeft -= 100;
  };
  refreshSubjects.onclick = function () {
    randomSubjects();
  };

 const clickBookSubject = (event) => {
    subjectName = event.target.innerText;
    //will clear out the book list to append the newly searched and found ones
    document.querySelectorAll(".bookListItems").forEach(el => el.remove());

    fetch(corsBaseUrl+subjectByNameBase+subjectName)
    .then(response => response.json())
    .then(data =>
        data.map(item => {
            let aBookId = parseInt(item.id);
            //replace {} with [] then replace the "" with '' because json parse only work with '' strings
            let genres = item.lcsh.replace(/{/g, '[').replace(/}/g, ']').replace(/'/g, '"');
            //turn it into an array
            genres = JSON.parse(genres);
           
            
            //the link for html books are all the same all you need is the specific  book id
            bookData[aBookId] = `https://www.gutenberg.org/cache/epub/${aBookId}/pg${aBookId}-images.html`;

            aBook = document.createElement("div");
            const bookDescr = document.createElement("div");
            const bookImage = document.createElement("img");
            const bookAuthor = document.createElement("div");
            const bookTitle = document.createElement("div");
            const subjectsCont = document.createElement("div");

            aBook.setAttribute("id", `${aBookId}`);
            bookDescr.setAttribute("id", `${aBookId}`);
            bookImage.setAttribute("id", `${aBookId}`);
            bookAuthor.setAttribute("id", `${aBookId}bookAuthor`);
            bookTitle.setAttribute("id", ` ${aBookId}bookTitle`);
            subjectsCont.setAttribute("id", ` ${aBookId}subjectsCont`);


            aBook.setAttribute("class", "bookListItems");
            bookDescr.setAttribute("class", "bookDescr");
            bookAuthor.setAttribute("class", "bookAuth");
            bookTitle.setAttribute("class", "bookTitle");
            subjectsCont.setAttribute("class", "subjectsCont");

            bookDescr.addEventListener("click", bookClicked);
            bookImage.addEventListener("click", bookClicked);
            aBook.addEventListener("click", bookClicked);
            bookAuthor.addEventListener("click", bookClicked2);
            bookTitle.addEventListener("click", bookClicked2);
            subjectsCont.addEventListener("click", bookClicked2);

            //all your url need to to get the book cover is book Id concat with the base url
            bookImage.src = `https://www.gutenberg.org/cache/epub/${aBookId}/pg${aBookId}.cover.medium.jpg`

            bookAuthor.innerText = item.author
            bookTitle.innerText = item.title;

            bookDescr.appendChild(bookAuthor);
            bookDescr.appendChild(bookTitle);
            aBook.appendChild(bookImage);

            if(item.lcsh.length >= 1){
                for(let genre of genres) {
                    const subject = document.createElement("span");
                    
                    subject.innerText = genre;
                    subjectsCont.appendChild(subject);
                }
            }
            bookDescr.appendChild(subjectsCont);
            aBook.appendChild(bookDescr);
            bookList.appendChild(aBook);
            if(aBook !== null ){
                loadingGrid.style.display = "none";
            }
            // searchAuthor(item.author)
    }))

  }

  const searchAuthor = (authorName) => {
    
    fetch(`${corsBaseUrl}https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${authorName}&format=json`)
    .then(data =>console.log(data))
  }