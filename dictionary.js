//our input tag
let inputData = document.getElementById("inputSearch");
//where the output get appears
let outputData = document.getElementById("outputPara");
// button which gives results on clicking
let resultBtn = document.getElementById("search");
//to get the prenounciation
let prenounciationArea = document.getElementById("audio");
//when no result is found :
let noResultFound = document.querySelector(".no-result");
//our api key :
const ourAPIkey = "b806881b-0e5f-4e8e-ad96-462d96ef4fc0";
//our loading spinner
let showLoadingSpinner = document.querySelector(".spinnerLoading");
//output section
let outputSection = document.querySelector(".output");
//event listeners after clicking on resultBtn
resultBtn.addEventListener("click", giveResultsOfWord);
function giveResultsOfWord(e) {
  //after searching for once it shows the previous searched values so first clear them everytime
  outputData.innerText = "";
  prenounciationArea.innerHTML = "";
  noResultFound.innerText = "";
  e.preventDefault();
  // ..first get the input which user types
  let wordTyped = inputData.value;
  if (wordTyped === "") {
    alert("Please Type Something..");
    return;
  }
  //get data from the api via function
  getData(wordTyped);
}
function getData(wordTyped) {
  //to check the progress of data

  showLoadingSpinner.style.display = "flex";
  outputSection.style.display = "block";
  const xhr = new XMLHttpRequest();
  //to get the items from this api
  xhr.open(
    "GET",
    `https://www.dictionaryapi.com/api/v3/references/learners/json/${wordTyped}?key=${ourAPIkey}`,
    true
  );
  //main  program to load the content from the API
  xhr.onload = function () {
    const parsedData = JSON.parse(this.responseText);
    if (!parsedData.length) {
      showLoadingSpinner.style.display = "none";
      noResultFound.innerHTML = `&rarr; <strong>No Result Found</strong> , Please Type Something Meaningfull ... `;
      return;
    }
    // //if result in not in the parsedData then give some auto suggestions via api
    if (typeof parsedData[0] === "string") {
      showLoadingSpinner.style.display = "none";
      let notFound = document.createElement("h4");
      notFound.className = "notFoundMessage";
      notFound.innerHTML = `Sorry,There is No Match Found Similar to <span style="color:#0a6b65be;">${wordTyped}</span>.<br>I Have Found Some Results Similar To The Word You Typed.Please Have a Look !`;
      noResultFound.appendChild(notFound);
      parsedData.forEach((suggestions) => {
        let newSpan = document.createElement("span");
        newSpan.className = "display-suggestions";
        newSpan.innerText = suggestions;
        noResultFound.appendChild(newSpan);
      });
      return;
    }
    showLoadingSpinner.style.display = "none";
    outputData.innerHTML = ` <strong>Meaning of <span style="color:#0a6b65be;">${wordTyped}</span> : </strong> ${parsedData[0].shortdef[0]} <br><br> Pronunciation in Text : ${parsedData[0].hwi.prs[0].ipa} <br><br> Part Of Speech: ${parsedData[0].fl}`;
    //check whether the prenounciation sound is present or not
    const audio = parsedData[0].hwi.prs[0].sound.audio;
    if (audio) {
      giveSound(audio);
    }
  };
  //send the request to the server
  xhr.send();
}

//get the sound / prenounciation
function giveSound(audio) {
  let subfolderOfWord = audio.charAt(0);
  let soundLocated = `https://media.merriam-webster.com/soundc11/${subfolderOfWord}/${audio}.wav?key=${ourAPIkey}`;
  let getAudio = document.createElement("audio");
  getAudio.className = "audio-elem";
  getAudio.src = soundLocated;
  getAudio.controls = true;
  prenounciationArea.appendChild(getAudio);
}

//GITHUB: @singhkunal01
