function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function fetchImageList(url) {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(error => console.error(`error: ${error.message}`));
}

function generateImage(data) {
    number = Math.round(Math.random () * 100);
    let currentImage = document.querySelector(".image-current").firstElementChild;

    let image = document.createElement("img");
    image.setAttribute("src", data[number].download_url);
    image.setAttribute("alt", " ");
    image.setAttribute("data-id", data[number].id );
    
    currentImage.replaceWith(image);
}

const randomImage = () => {

    if (localStorage.getItem('imageList')) {
        let imageList = JSON.parse(localStorage.getItem('imageList'));
        return generateImage(imageList);
    }

    return fetchImageList(url)
        .then(data => {
            generateImage(data);
            localStorage.setItem('imageList', JSON.stringify(data));
        });
}

const addImage = () => {

let imageList = JSON.parse(localStorage.getItem('imageList'));

let currentImage = document.querySelector(".image-current").firstElementChild;
let currentImageId = currentImage.getAttribute("data-id");

    if (!currentUser) {
        // this shouldn't be possible for failsafe anyway
        let currentUser = "guest";
    }

    if (localStorage.getItem(currentUser)) {
        console.log(`Current Collection found for Current User`);
        collection = JSON.parse(localStorage.getItem(currentUser));
    }

    collection[currentImageId] = imageList[currentImageId];
    localStorage.setItem(currentUser, JSON.stringify(collection));
    console.log(`Image Added to ${currentUser}'s collection`)
}

const showCollection = () => {
    
    if (!currentUser) {
        // this shouldn't be possible for failsafe anyway
        let currentUser = "guest";
    }

    if (!localStorage.getItem(currentUser)) {
        return console.log(`No Collection found for Current User`);
    }

    console.log(`Current Collection found for Current User`);
    console.log(`current user: ${currentUser}`);
    collection = JSON.parse(localStorage.getItem(currentUser));
    Object.entries(collection).forEach(([key, val]) => {
        itemLi = document.createElement("li");
        itemLi.setAttribute("data-id", key);
        itemLi.classList.add("collection-item");

        itemImg = document.createElement("img");
        itemImg.setAttribute("src", val.download_url);
        itemImg.setAttribute("alt", " ");
        itemImg.setAttribute("data-id", key );
        
        itemDiv = document.createElement("div");
        itemDiv.classList.add("item-remove");

        itemIcon = document.createElement("i");
        itemIcon.textContent = "X";
        
        itemDiv.append(itemIcon);
        itemLi.append(itemImg, itemDiv);
        collectionList.append(itemLi);
    });
}

function getUserList() {
    if (!localStorage.getItem("userList")) {
        console.log(`error: No userList Found`);
        let userList = ["Guest"];
        localStorage.setItem("userList", JSON.stringify(userList));
        return userList;
    } 
    return JSON.parse(localStorage.getItem("userList"));
}

function listUsers() {
    let userList = getUserList();

    let options = document.querySelector("#switch-user");

    for ( i = 1; i < userList.length; i++) {
        let option = document.createElement("option");
        option.value = userList[i];
        option.text = userList[i];
        options.add(option);
    }
}

const switchUser = () => {
    console.log("User Switch Performed");
    //set currentUser to new user
    //switch header to new user
    //switch collection header to new user
    //load new empty collection
}

// Could Fit these functions together.
const formSubmitNew = (event) => {
    event.preventDefault();

    // Get Username
    username = formNewUser.querySelector("#new-email").value;
    
    // Get User List
    if (localStorage.getItem["userList"]) {
        userList = JSON.parse(localStorage.getItem["userList"]);
    }

    // Check if User exists
    if (userList.includes(username)) {
        return console.log("Error: User Already Exists!");
    }

    // Add New User to userlist
    userList.push(username);
    localStorage.setItem("userList", JSON.stringify(userList));

    // Update User Selection Option
    let options = document.querySelector("#switch-user");
    let option = document.createElement("option");
    option.value = username;
    option.text = username;
    options.add(option);

    // Perform User Switch
    switchUser(username);

    //close dialog
    dialogNewUser.close();

    //notify user of success
}

const formSubmitSwitch = (event) => {
    event.preventDefault();

    //grab form input for new user name
    switchUser(username);

    //close dialog
    dialogSwitchUser.close();

    //notify user of success
}

const onLoadHandler = () => {
    listUsers();
    randomImage();
    showCollection();
}

const limit = 100;
const url = `https://picsum.photos/v2/list?limit=${limit}`;

let currentUser = localStorage.getItem('currentUser') === null ? "guest" : localStorage.getItem('currentUser');
const userLabel = document.querySelector("h2 span.user");

if (currentUser !== null) {
    userLabel.textContent = currentUser;
}

let collection = {};

const imageRandomButton = document.querySelector(".image-new");
const imageAddButton = document.querySelector(".image-add");
const collectionList = document.querySelector(".collection-list");

const dialogNewUser = document.querySelector("#dialog-new");
const buttonNewOpen = document.querySelector("#button-new-open");
const buttonNewClose = document.querySelector("#button-new-close");
const formNewUser = document.querySelector("#form-new");
const buttonNewSubmit = document.querySelector("#button-new-submit");
buttonNewOpen.addEventListener("click", () => dialogNewUser.showModal());
buttonNewClose.addEventListener("click", () => dialogNewUser.close());
buttonNewSubmit.addEventListener("click", formSubmitNew);

const dialogSwitchUser = document.querySelector("#dialog-switch");
const buttonSwitchOpen = document.querySelector("#button-switch-open");
const buttonSwitchClose = document.querySelector("#button-switch-close");
const formSwitchUser = document.querySelector("#form-switch");
const buttonSwitchSubmit = document.querySelector("#button-switch-submit");
buttonSwitchOpen.addEventListener("click", () => dialogSwitchUser.showModal());
buttonSwitchClose.addEventListener("click", () => dialogSwitchUser.close());
buttonSwitchSubmit.addEventListener("click", formSubmitSwitch);

document.addEventListener('DOMContentLoaded', onLoadHandler);

imageRandomButton.addEventListener("click", randomImage);
imageAddButton.addEventListener("click", addImage);