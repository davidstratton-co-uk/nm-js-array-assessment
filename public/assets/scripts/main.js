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
    
    currentImage.replaceWith(image);
}

const currentUser = localStorage.getItem('currentUser') === null ? null : localStorage.getItem('currentUser');
const userLabel = document.querySelector("h2 span.user");

if (currentUser !== null) {
    userLabel.textContent = currentUser;
}

const randomImage = () => {

    console.log(`Random Image!`);
    if (localStorage.getItem('imageList')) {
        console.log(`Local List Random Image!`);
        let imageList = JSON.parse(localStorage.getItem('imageList'));
        return generateImage(imageList);
    }

    return fetchImageList(url)
        .then(data => {
            generateImage(data);
            localStorage.setItem('imageList', JSON.stringify(data));
        });
}

const imageButton = document.querySelector(".image-new");

document.addEventListener('DOMContentLoaded', randomImage);
imageButton.addEventListener("click", randomImage);
