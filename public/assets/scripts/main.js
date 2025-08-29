const limit = 100;
const url = `https://picsum.photos/v2/list?limit=${limit}`;

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

let currentUser = localStorage.getItem('currentUser') === null ? "guest" : localStorage.getItem('currentUser');
const userLabel = document.querySelector("h2 span.user");

if (currentUser !== null) {
    userLabel.textContent = currentUser;
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
        itemLi.append(itemImg);

        itemDiv = document.createElement("div");
        itemDiv.classList.add("item-remove");
        itemImg.append(itemDiv);

        itemIcon = document.createElement("i");
        itemIcon.textContent = "X";
        itemDiv.append(itemIcon);

        collectionList.apprend(itemLi);
    });
}

let collection = {};

const imageRandomButton = document.querySelector(".image-new");
const imageAddButton = document.querySelector(".image-add");
const collectionList = document.querySelector(".collection-list");


document.addEventListener('DOMContentLoaded', randomImage);
document.addEventListener('DOMContentLoaded', showCollection);
imageRandomButton.addEventListener("click", randomImage);
imageAddButton.addEventListener("click", addImage);