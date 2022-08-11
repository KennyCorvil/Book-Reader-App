import NotesAPI from "./NotesAPI.js" 

const synth = window.speechSynthesis;//SpeechSynth API

//letiables declarations
let file, 
    textToRead,
    timer, 
    endValue, 
    innerTxt;

//DOM elements
const bookRender = document.querySelector("#book-render"),
    defModal = document.querySelector(".defModal"),
    defBtn = document.querySelector(".defBtn"),
    defBtnImg = document.querySelector("#defBtnImg"),
    defList = document.querySelector(".defList"),
    zoomBtn1 = document.querySelector("#zoomOutBtn"),
    zoomBtn2 = document.querySelector("#zoomInBtn"),
    openAudio = document.querySelector(".btn-opendAudio"),//open the tts player 
    playTts = document.querySelector(".btn-play-pause"),//play button
    backTts = document.querySelector(".btn-back"),//backward button
    forwardTts = document.querySelector(".btn-forward"),//forward button
    ttsSettings = document.querySelector(".tts-modal"),// modal containing pitch and rate
    openTtsSettings = document.querySelector(".audio-settings"),// open tts left corner button
    ttsPlayOpen = document.querySelector(".tts-btn"),//player div
    ttsClose = document.querySelector(".btn-closeTts"),//close the tts player btn
    rate = document.querySelector("#rate"),//rate slide
    rateValue = document.querySelector(".rateValue"),//rate value span
    pitch = document.querySelector("#pitch"),//pitch slide
    pitchValue = document.querySelector(".pitchValue"),//pitch value span
    voiceSelect = document.querySelector(".voice-select"),//voice select
    playAudioBtn = document.querySelector(".btn-play"),
    stopAudioBtn = document.querySelector(".btn-stop"),
    pauseAudioBtn = document.querySelector(".btn-pause"),
    noteContainer = document.querySelector(".noteContainer"),//notepad modal container
    noteHeader = document.querySelector(".noteHeader"),//notepad head div
    noteTextarea = document.querySelector("#noteText"),//notepad texarea
    noteBtnContainer = document.querySelector(".note-btn"),
    clearNoteBtn = document.querySelector(".clear-btn"),//notepad clear button
    cancelNoteBtn = document.querySelector(".cancel-btn"),//notepad cancel button
    saveNoteBtn = document.querySelector(".save-btn"),//notepad save button
    exitNote = document.querySelector(".exitNote"),//notepad close button
    openNotePad = document.querySelector(".noteBtn"),
    noteOpacity = document.querySelector(".noteOpacity"),
    searchTextBtn = document.querySelector(".searchBtn"),
    searchInput = document.getElementById("searchInput"),
    noteTitle = document.querySelector(".noteTitle"),
    viewAllnotes = document.querySelector(".viewAllnotes"),
    newNoteBtn  = document.querySelector(".newNoteBtn"),
    noteList = document.querySelector(".noteList"),
    noteTknBtns = document.querySelector(".noteTknBtn"),
    listNoteBtns = document.querySelector(".listNoteBtn"),
    deleteNoteBtn = document.querySelector(".delete-btn"),
    openNoteBtn = document.querySelector(".open-btn"),
    lineSpacingBtn = document.querySelector(".lineSpacingBtn"),
    spacingContent = document.querySelector(".spacing-content"),
    textP = document.getElementsByTagName("p"),
    darkLightBtn = document.querySelector(".darkLightBtn"),
    darkLightImg = document.querySelector(".darkLightImg"),
    tableDropBtn = document.querySelector(".table-dropbtn"),
    tableDropdown = document.querySelector(".table-dropdown");

let noteListItems, tableOfContent;
let onOff = false,
    settingOn = false,
    playOrPause = false,
    noteIsOpen = false,
    notTransparent = true,
    searchIsOpen = false,
    noteListOn = false,
    spacingIsOn = false,
    lightModeIsOn = true;


console.log(localStorage.getItem("bookId"))
displayBook();

//opens the tts player
openAudio.onclick = () => {
    onOff = !onOff;
    onOff?ttsPlayOpen.style.display = "flex":ttsPlayOpen.style.display = "none";
    openAudio.style.display = "none";
}
//opens the tts player menu
openTtsSettings.onclick = () => {
    settingOn = !settingOn;
    
    settingOn && onOff?ttsSettings.style.display = "flex":ttsSettings.style.display = "none";
    if(settingOn){
        ttsSettings.addEventListener("onmouseover", overTTSSettings());
        ttsSettings.addEventListener("onmouseout", outTTSSettings());
    }
}
//close the tts player
ttsClose.onclick = () => {
if(onOff){
    synth.cancel();//stop the tts
    ttsSettings.style.display = "none";
    ttsPlayOpen.style.display = "none";
    openAudio.style.display = "flex";
    onOff = false;
    playOrPause = false;
    settingOn = !settingOn;

    pauseAudioBtn.style.display = "none";
    playAudioBtn.style.display = "flex";
    audioIsPlaying = false;
    }
}
// function fade() {
//     settingOn = false;
//     let op = 1;  // initial opacity
//     let timer = setInterval(function () {
//         if (op <= 0.1){
//             clearInterval(timer);
//             ttsSettings.style.display = 'none';
//         }
//     ttsSettings.style.opacity = op;
//     ttsSettings.style.filter = 'alpha(opacity=' + op * 100 + ")";
//     op -= op * 0.1;
//     }, 500);
// }

function outTTSSettings() {
    
}

function overTTSSettings() {
    ttsSettings.style.opacity = "1";
    ttsSettings.style.display = "flex";
}



    
function displayBook() {
    let book = localStorage.getItem("bookData");
    //localStorage.removeItem("bookData");
    
    //deleting the html, and head of the file to keep body's content
    //sometimes the style is inside the body so the slice should start at </style>
    if(book.indexOf("<body>") < book.indexOf("</style>")){
        book = book.slice(book.indexOf("</style>"), book.indexOf("</html>"));
    }
    
    let styles = book.slice(book.indexOf("<style"), book.indexOf("</style"));
    styles = styles.slice(styles.indexOf("body"));

    //grab the table of content from the the book html file
    let table = book.slice(book.indexOf("<tr"), book.indexOf("</table>"));
    book = book.replace(table, "");//remove the table of content 

    //create a table element that will be appended to the content dropdown btn
    tableOfContent = document.createElement("div");
    tableOfContent.setAttribute("class", "dropdown-table-content");
    tableOfContent.innerHTML = table;
    tableDropdown.appendChild(tableOfContent);


    if(book.indexOf(" ***</div>") != -1){

        book = book.slice(book.indexOf(" ***</div>"), book.indexOf("</html>"));
        book = book.replace(" ***</div>", "<div class ='book-text'>"); 
        book = book.replace(/<\/body>/g,"</div>"); 

    }else{
        
        book = book.slice(book.indexOf("<body>"), book.indexOf("</html>"));
        //replacing body tags with div 
        book = book.replace(/<body>/g, "<div class ='book-text'>");  
        book = book.replace(/<\/body>/g,"</div>"); 
    }
    let baseIgmUrl =`https://www.gutenberg.org/cache/epub/${localStorage.getItem("bookId")}`;
    
    let imageSrc = book.slice(book.indexOf("src"), book.indexOf("/"));
    //book = book.replace(imageSrc, baseIgmUrl);
    //add book content to the bookrender div
    bookRender.innerHTML = book;
    bookRender.addEventListener("mouseup", selectedTextAreaMouseUp);
    document.addEventListener("mousedown", pageMouseDown);

    let styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet);

    let bookImg = bookRender.querySelectorAll("img");
    bookImg.forEach(el => {
        let oldSrc = el.src.slice(el.src.indexOf("/images"));
        el.removeAttribute('src');
        el.src = baseIgmUrl+oldSrc;
    })

}

    
//word count
function WordCount(str) { 
    return str.split(" ").length;
    }

let selectedText,
wordDefinition = [], 
wordExample = [];

function selectedTextAreaMouseUp(event) {

    setTimeout(() => {
        //gets the selected text and assign it to a constant
        selectedText = window.getSelection().toString().trim();


        if(WordCount(selectedText) > 3){
        hasTextToRead = true;
            // let autoRead;

            let innerTxt = this.innerText, textSliced;
            
            textSliced = innerTxt.slice(innerTxt.indexOf(selectedText))

            //every time a new text is selected and sliced
            //it will verify if the text in the textToRead variable is the same as the new text sliced
            //if they are not the same it will stop the player and replace it 
            if(textSliced !== textToRead){
                synth.cancel();
                textToRead = textSliced;
                //console.clear()
            }
            // function count(){
            //     clearTimeout(timer);
            //     endValue += 200;

            //     textToRead.push(innerTxt.slice(innerTxt.indexOf(selectedText), (innerTxt.indexOf(selectedText)+200)));
            //     if(endValue < innerTxt.length){ timer = setTimeout(count,1000); }
            // }    
        }


        if(WordCount(selectedText) < 4){
            //gets the postion of the selected text
            const x = event.pageX;
            const y = event.pageY;
            //gets the height and width of the defmodal
            const defModalWidth = Number(getComputedStyle(defModal).width.slice(0,-2));
            const defModalHeight = Number(getComputedStyle(defModal).height.slice(0,-2));
    
            let defTitle = document.getElementsByClassName("defTitle");
            let defSubTitle = document.getElementsByClassName("defSubTitle");
            for (let i = 0; i < defTitle.length; i++) {
                defTitle[i].textContent = selectedText;
                defSubTitle[i].textContent = `Definitions of "${selectedText}"`;
            }

            //opening definition modal popup when text is highlighted
            if(selectedText.length){
                defModal.style.display = "flex";
                defModal.style.transform = "scale(1)";
                /*give the position to the modal*/
                defModal.style.left = `${x-150}px`;
                defModal.style.top = `${y-100}px`;
            }

            if(selectedText !==""){
                
                fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selectedText}`)
                .then(response => response.json())
                .then(data => data.map(item => {
                    item.meanings.slice(0,3).map((def, index1) => {
                        def.definitions.slice(0,2).map((find, index2 )=> {
                            wordDefinition.push(find.definition);
                            wordExample.push(find.example);
                            let liOne = document.createElement("li");
                            let liTwo = document.createElement("li");
                            let ul = document.createElement("ul");
                            liOne.setAttribute("class", "definitions");
                            ul.setAttribute("class", "definitions");
                            liTwo.setAttribute("class", "definitions");
                            liOne.textContent = find.definition!==undefined?find.definition:null;
                            liOne.appendChild(ul);
                            liTwo.textContent = find.example!==undefined?find.example:null;
                            ul.appendChild(liTwo)
                            defList.appendChild(liOne)
                            
                        })
                    })
                }))
                .catch(error=>console.log(error));
            }
        }

    }, 0);
}

let wordIsSaved = false;

function defBtnClicked() {
    wordIsSaved = true;
    //when clicked it will save the definitions of the word to the notes using the NotesAPI
    NotesAPI.saveNote({
        title: `${selectedText}`,
        body: `${wordDefinition.join("\n \n")}`
    });
    
    if(wordIsSaved){
        defBtnImg.classList.remove("fa-pen-to-square");
        defBtnImg.classList.add("fa-square-check");
        defBtn.style.color = "#4ECCA3";
    }
    
    

}


defBtn.addEventListener("click", defBtnClicked);

function pageMouseDown(event) {

    //if function to make sure click is not on def modal for it to go away
    if(getComputedStyle(defModal).display === "flex" && event.target.id!="defModal" && event.target.id!="defBtnImg"
     && event.target.className!="definitions"){ 
        window.getSelection().empty();
        defModal.style.display = "none";
        defModal.style.transform = "scale(0)";
        defModal.style.left = '0';
        defModal.style.top = "0";
        defBtnImg.classList.add("fa-pen-to-square");
        defBtnImg.classList.remove("fa-square-check");
        defBtn.style.color = "#eee";
        //remove the the ul's lists so the new one cn be created 
        document.querySelectorAll(".definitions").forEach(el => el.remove());
    }
}

let scrolled;
// scroll navbar tracker 
window.onscroll = () => {scrollNav()};

function scrollNav() {
  let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrolled = (winScroll / height) * 100;
  //console.log(scrolled)
  document.getElementById("scrollBar").style.width = scrolled + "%";
}

zoomBtn1.addEventListener("click", zoomOutClicked);
zoomBtn2.addEventListener("click", zoomInClicked);
//Zoom out
function zoomOutClicked() {
    const bookFontSize = Number(getComputedStyle(bookRender).fontSize.slice(0,-2));
    if(bookFontSize>5){
        bookRender.style.fontSize = `${bookFontSize-1}px`;
    }
}
//Zoom in
function zoomInClicked() {
    const bookFontSize = Number(getComputedStyle(bookRender).fontSize.slice(0,-2));
    bookRender.style.fontSize = `${bookFontSize+1}px`;
}

lineSpacingBtn.onclick = () => {
    bookRender.style.fontSize = `${bookFontSize-1}px`;
}

//getting tts voices
let voices = [];

const getVoices = () => {
    voices = synth.getVoices();

    //loop through the voices
    voices.forEach(voice => {
        //create option elements
        const option = document.createElement("option");
        //fill option with voice
        option.textContent = voice.name + "("+ voice.lang +")";

        //set option attributes
        option.setAttribute("data-lang", voice.lang);
        option.setAttribute("data-name", voice.name);
        voiceSelect.appendChild(option);
    });
};

getVoices();
if(synth.onvoiceschanged !== undefined){
    synth.onvoiceschanged = getVoices;
}

//speak
const speak = () => {
        playOrPause = true;
//check if speaking
    if(synth.speaking){
        console.error("already speaking...");
        return;
    }
    if(textToRead !== "" ){
        let startReading = textToRead.slice(0, textToRead.indexOf(".")+1);
        let speakText = new SpeechSynthesisUtterance(startReading);

        // startReading.forEach(text => {
        //     speakText = new SpeechSynthesisUtterance(text);
        //     console.log(startReading)
        // })
        textToRead = textToRead.slice(textToRead.indexOf(".")+1);
        speak()

        console.log(startReading)

        
        //
        // if(textToRead === ""){
        //     startReading = textToRead.slice(0,textToRead.indexOf(".")+1);
        //     speakText = new SpeechSynthesisUtterance(startReading);
        //     console.log(startReading)
        // }
        // for(let i = 0; i < startReading.length; i++) {
        //     playOrPause = true; 
        //     // for each iteration console.log a word
        //     // and make a pause after it
        //     (function (i) {
        //         setTimeout(function () {
        //             speakText = new SpeechSynthesisUtterance(startReading[i]);
        //             console.log(startReading[i]);
        //         }, 1000 * i);
        //     })(i);
        // };

        
        //speak end
        speakText.onend = e => {
            
            
            playOrPause = false; 
        }
    

        //speak error
        speakText.onerror = e => {
            console.log("something went wrong")
        }

        //selected voice
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute("data-name");

        //loop through voices
        voices.forEach(voice => {
            if(voice.name === selectedVoice){
                speakText.voice = voice;
            }
        });

        //set pitch and rate
        speakText.rate = rate.value = rate.value;
        speakText.pitch = pitch.value = pitch.value;

        //speak
        synth.speak(speakText);

    }
}
let hasTextToRead = false;
//switch between play and pause


let audioIsPlaying = false;

playAudioBtn.onclick = () => {
    if(!audioIsPlaying){
        audioIsPlaying  = true;
        speak();
        playAudioBtn.style.display = "none";
        pauseAudioBtn.style.display = "flex";
}
    //console.log(textToRead)
    if(audioIsPlaying && !playOrPause){
        synth.resume();
        playOrPause = true;
        playAudioBtn.style.display = "none";
        pauseAudioBtn.style.display = "flex";
    }
}


pauseAudioBtn.onclick = () => {
    if(audioIsPlaying && playOrPause){
        synth.pause();
        playOrPause = false;
        pauseAudioBtn.style.display = "none";
        playAudioBtn.style.display = "flex";
    }
}

const onNoteDrag = ({movementX, movementY}) => {
    //getting the style of the header
    let getNoteStyle = window.getComputedStyle(noteContainer);
    let left = parseInt(getNoteStyle.left);//get the value of left 
    let top = parseInt(getNoteStyle.top);//get value of top

    noteContainer.style.left = `${left + movementX}px`;
    noteContainer.style.top = `${top + movementY}px`;
}
searchInput.addEventListener("click", () => {
    searchText();
})
//makes the serach bar larger or smaller when clicked
function searchText() {
   searchIsOpen = !searchIsOpen;
   
   if(searchIsOpen){
        searchInput.classList.remove("smallSearch");
        searchInput.classList.add("largeSearch");
   }
   if(!searchIsOpen){
        searchInput.classList.remove("largeSearch");
        searchInput.classList.add("smallSearch");
    }
}
searchTextBtn.onclick = () => {
    searchText();
    let textToSearch = searchInput.value;
    let options = {
        "element": "mark",
        "className": "",
        "exclude": [],
        "separateWordSearch": true,
        "accuracy": "exactly",
        "diacritics": true,
        "synonyms": {},
        "iframes": false,
        "iframesTimeout": 5000,
        "acrossElements": false,
        "caseSensitive": false,
        "ignoreJoiners": false,
        "ignorePunctuation": [],
        "wildcards": "disabled",
        "filter": function(textNode, foundTerm, totalCounter, counter){
            // textNode is the text node which contains the found term
            // foundTerm is the found search term
            // totalCounter is a counter indicating the total number of all marks
            //              at the time of the function call
            // counter is a counter indicating the number of marks for the found term
            return true; // must return either true or false
        },
        "noMatch": function(term){
            // term is the not found term
        },
        "done": function(counter){
            // counter is a counter indicating the total number of all marks
        },
        "debug": false,
        "log": window.console
    };
    let instance = new Mark(bookRender);
    instance.mark(textToSearch, options); // will mark the keyword textToSearch value
}



//rate change
rate.addEventListener("change", e => rateValue.textContent = rate.value);

//pitch change
pitch.addEventListener("change", e => pitchValue.textContent = pitch.value);

//voice selection change
voiceSelect.addEventListener("change", e => speak());

//making the notepad draggable
//noteContainer 
noteHeader.addEventListener("mousedown", () => {
    noteHeader.addEventListener("mousemove", onNoteDrag)
}); 
document.addEventListener("mouseup", () => {
    noteHeader.removeEventListener("mousemove", onNoteDrag)
}); 
// noteText 
clearNoteBtn.onclick = () => {
    noteTitle.value = "";
    noteTextarea.value = "";
}
//noteTitle
cancelNoteBtn.onclick = () => {
    noteTitle.value = "";
    noteTextarea.value = "";
    noteIsOpen = false;
    noteContainer.style.display = "none";
}

viewAllnotes.onclick = () => {
    noteListOn = true;
    if(noteListOn){
        noteHeader.style.backgroundColor = "#19456B";
        noteContainer.style.backgroundColor = "#19456B";
        noteTitle.style.display = "none";
        noteTextarea.style.display = "none";
        //noteBtnContainer.style.display = "none";
        viewAllnotes.style.display = "none";
        newNoteBtn.style.display = "flex";
        //noteListItems.style.display = "flex";
        noteList.style.display = "flex";
        noteTknBtns.style.display= "none";
        listNoteBtns.style.display= "flex";
        getListofNotes();
        noteDblClicked();
        noteClicked();
    }
    
}
newNoteBtn.onclick = () => {
    noteListOn = false;
    if(!noteListOn){
        noteHeader.style.backgroundColor = "rgb(210, 208, 208)";
        noteContainer.style.backgroundColor = "#eee";
        noteTitle.style.display = "flex";
        noteTextarea.style.display = "flex";
        //noteBtnContainer.style.display = "flex";
        viewAllnotes.style.display = "flex";
        newNoteBtn.style.display = "none";
        //noteListItems.style.display = "none";
        noteList.style.display = "none";
        listNoteBtns.style.display= "none";
        noteTknBtns.style.display= "flex";
        noteTitle.value = "";
        noteTextarea.value = "";
    }

    noteListItems.forEach(el => el.remove());
}
let noteClickedId;
function noteDblClicked(event) {
    noteClickedId = parseInt(event.target.id);
    openANote();
}
function noteClicked(event) {
    noteClickedId = parseInt(event.target.id);

    deleteNoteBtn.style.backgroundColor = "#f44336";
    openNoteBtn.style.backgroundColor = "#19456B";

    noteListItems.forEach(item => {
        if(item.id == noteClickedId){
            item.style.backgroundColor = "#4ECCA3";
        }else if (item.id != noteClickedId){
            item.style.backgroundColor = "#eee";
        }
    })
} 

deleteNoteBtn.onclick = () => {
    NotesAPI.deleteNote(noteClickedId);
    noteListItems.forEach(el => {
        if(el.id == noteClickedId){
            el.remove()
    }});
    
    deleteNoteBtn.style.backgroundColor = "#f8928a";
    openNoteBtn.style.backgroundColor = "#356b9b";
    noteClickedId = 0;
    
}
openNoteBtn.onclick = () => {
    openANote();
}

const openANote = () => {
    noteListOn = false;
    if(!noteListOn){
        noteHeader.style.backgroundColor = "rgb(210, 208, 208)";
        noteContainer.style.backgroundColor = "#eee";
        noteTitle.style.display = "flex";
        noteTextarea.style.display = "flex";
        noteBtnContainer.style.display = "flex";
        viewAllnotes.style.display = "flex";
        newNoteBtn.style.display = "none";
        //noteListItems.style.display = "none";
        noteList.style.display = "none";
        listNoteBtns.style.display= "none";
        noteTknBtns.style.display= "flex";
        
        NotesAPI.getAllNotes().map(item => {
            if(item.id === noteClickedId){
                noteTitle.value = item.title;
                noteTextarea.value = item.body;
            }
        })
    }
    noteClickedId = 0;
    noteListItems.forEach(el => el.remove());
}

const getListofNotes = () => {
    
    NotesAPI.getAllNotes().map( item => {
        const notesDiv = document.createElement("div");
        const titleDiv = document.createElement("div");
        const bodyDiv = document.createElement("div");
        const dateDiv = document.createElement("div");
        
        notesDiv.setAttribute("id", `${item.id}`);
        titleDiv.setAttribute("id", `${item.id}titleDiv`);
        bodyDiv.setAttribute("id", ` ${item.id}bodyDiv`);
        dateDiv.setAttribute("id", ` ${item.id}dateDiv`);

        notesDiv.setAttribute("class", "noteListItems");
        titleDiv.setAttribute("class", "noteTitle");
        bodyDiv.setAttribute("class", "noteSample");
        dateDiv.setAttribute("class", "noteDate");

        notesDiv.addEventListener("dblclick", noteDblClicked);
        notesDiv.addEventListener("click", noteClicked);

        titleDiv.innerText = item.title;
        bodyDiv.innerText = item.body.substring(0, 70) +"...";
        dateDiv.innerText = item.updated.substring(0, 10);
        notesDiv.appendChild(titleDiv);
        notesDiv.appendChild(bodyDiv);
        notesDiv.appendChild(dateDiv);
        noteList.appendChild(notesDiv);
        
        noteListItems = document.querySelectorAll(".noteListItems")
    })
    
}

//saves the notes data to lacal storage by calling notesapi.js 
saveNoteBtn.onclick = () => {

    let noteTitleValue = noteTitle.value;
    let notebodyValue = noteTextarea.value;

    NotesAPI.saveNote({
        title: `${noteTitleValue}`,
        body: `${notebodyValue}`
    });
};
exitNote.onclick = () => {
    noteIsOpen = false;
    noteContainer.style.display = "none";
};
openNotePad.onclick = () => {
    if(!noteIsOpen){
    noteIsOpen = true;
    noteContainer.style.display = "flex";
}
};
noteOpacity.onclick = () => {
    notTransparent = !notTransparent;
    notTransparent?noteContainer.style.opacity = "1":noteContainer.style.opacity = "0.9";
    !notTransparent?noteOpacity.style.color = "#eee":noteOpacity.style.color = "#232931";
};

lineSpacingBtn.onclick = () => {
    
    spacingIsOn = true;

    spacingIsOn?spacingContent.style.display = "flex":spacingContent.style.display = "none";

    if(spacingIsOn){
        let el;
        document.querySelector(".spacingOne").addEventListener("click", () => {
            for(el of textP){
                el.style.lineHeight = "1.5";
            };
            spacingContent.style.display = "none";
            
        })

        document.querySelector(".spacingTwo").addEventListener("click", () => {
            for(el of textP){
                el.style.lineHeight = "2.5";
            }
            spacingContent.style.display = "none";
        })

        document.querySelector(".spacingThree").addEventListener("click", () => {
            for(el of textP){
                el.style.lineHeight = "3";
            }            
            spacingContent.style.display = "none";
        })
    }
};

darkLightBtn.onclick = () => {
    lightModeIsOn = !lightModeIsOn;

    let styleLink = document.querySelector("#lnk");
    
    if(!lightModeIsOn){
        styleLink.setAttribute("href", "./css/styleLight.css");
        darkLightImg.classList.remove("fa-toggle-on");
        darkLightImg.classList.add("fa-toggle-off");
    }
    if(lightModeIsOn){
        styleLink.setAttribute("href", "./css/style.css"); 
        darkLightImg.classList.remove("fa-toggle-off");
        darkLightImg.classList.add("fa-toggle-on");
        noteContainer.style.backgroundColor = "rgb(210, 208, 208)";
    }
}

let tableContentIsOn = false;

tableDropBtn.onclick = () => {
    console.log("sneed")
    tableContentIsOn = !tableContentIsOn;
    tableContentIsOn?tableOfContent.style.display = "flex":tableOfContent.style.display = "none"
}
