

let baseUrl = "https://gutendex.com/books?search=";
let bookTitle = "moral sentiment"
let file, booklet, aBook, bookId;

const bookDragDrop = document.querySelector(".drag-area"),//
      bookUploadBtn = document.querySelector(".book-upload"),// button to search and select file
      bookInput = document.querySelector(".bookInput"),
      openSearchBar = document.querySelector(".searchBarOpen"),
      bookSearchBar = document.querySelector(".searchBook"),
      searchBookInput = document.querySelector(".searchBookInput"),
      searchBookBtn = document.querySelector(".searchBookBtn"),
      bookList = document.querySelector(".bookList");

let searchIsOpen = false;

const bookData = {};

openSearchBar.onclick = () => {
    searchIsOpen = !searchIsOpen;
    if(!searchIsOpen){
        bookSearchBar.style.display = "none";
        bookDragDrop.style.display = "flex";
        bookList.style.display = "none";
    }
    if(searchIsOpen){
        bookSearchBar.style.display = "flex"; 
        bookDragDrop.style.display = "none";
        bookList.style.display = "flex";
    }
}

searchBookBtn.onclick = () => {
    searchForBook();
}

const searchForBook = () => {
    let bookToSearch = searchBookInput.value;
    console.log("sneed")
    console.log(bookToSearch)
    console.log(searchBookInput.value)
    if(bookToSearch !== ""){
        
        //will clear out the book list to append the newly searched and found ones
        document.querySelectorAll(".bookListItems").forEach(el => el.remove());

        fetch(baseUrl+bookToSearch)
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
            bookData[item.id] = item.formats["text/html"];

            aBook.setAttribute("class", "bookListItems");
            bookDescr.setAttribute("class", "bookDescr");
            bookAuthor.setAttribute("class", "bookAuth");
            bookTitle.setAttribute("class", "bookTitle");
            subjectsCont.setAttribute("class", "subjectsCont");

            bookDescr.addEventListener("click", bookClicked);
            bookImage.addEventListener("click", bookClicked);
            aBook.addEventListener("click", bookClicked);
            
            bookImage.src = item.formats["image/jpeg"];

            item.authors.map(res => {
                bookAuthor.innerText = res.name
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
            
        })
        )
        bookSearchBar.style.display = "none";
        searchIsOpen = false;
        
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
    localStorage.removeItem("bookData");
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
                console.log(data)
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
    localStorage.removeItem("bookData");
    //fetch the file and pass the data to the book letiable
    // fetch("https://cors-anywhere.herokuapp.com/"+file)
    fetch(file)
    .then(response => response.text())
    .then(data => {
        localStorage.setItem("bookData", data);
        window.open("./bookDisplay.html","_self");
    });
}


function bookClicked(event) {
    bookId = String(event.target.id)
    file = bookData[bookId];
    displayBook2();
    
}


