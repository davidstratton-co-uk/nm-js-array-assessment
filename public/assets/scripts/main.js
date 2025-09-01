/****
 ** Config
 ****/
const limit = 100;
const url = `https://picsum.photos/v2/list?limit=${limit}`;


/****
 ** Utilities
 ****/

/**
 * Check Promise Status
 */
const checkStatus = (response) => {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

/**
 * Fetch Image List from API
 */
const fetchImageList = (url) => {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(error => console.error(`error: ${error.message}`));
}

/**
 * Pick Random Image from Image List
 * Replace Image with New Image
 */
const generateImage = (data) => {
    number = Math.round(Math.random () * 100);
    let currentImage = document.querySelector(".image-current").firstElementChild;

    let image = document.createElement("img");
    image.setAttribute("src", data[number].download_url);
    image.setAttribute("alt", " ");
    image.setAttribute("data-id", data[number].id );
    
    currentImage.replaceWith(image);
}

/**
 * Check if Image List is in local storage if not fetch list from api
 */
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

/**
 * Add Image to users collection
 * Update collection in local storage
 */
const addImage = () => {

let imageList = JSON.parse(localStorage.getItem('imageList'));

let currentImage = document.querySelector(".image-current").firstElementChild;
let currentImageId = currentImage.getAttribute("data-id");

    if (localStorage.getItem(currentUser)) {
        collection = JSON.parse(localStorage.getItem(currentUser));
    }

    // Update Collection
    collection[currentImageId] = imageList[currentImageId];
    localStorage.setItem(currentUser, JSON.stringify(collection));

    // reload Collection
    // FIXME: only remove single image don't reload entire collection
    showCollection();

    //TODO: Notify User Image was added on webpage.
}

/**
 * Remove Image to users collection
 * Update collection in local storage
 */
const removeImage = (event) => {

    if (!(event.target.classList.contains("item-remove") || event.target.parentElement.classList.contains("item-remove"))) {
        return;
    }

    if (event.target.parentElement.classList.contains("item-remove")) {
        parent = event.target.parentElement.parentElement;
    } else {
        parent = event.target.parentElement;
    }

    let image = parent.getAttribute("data-id");

    // get collection from local storage
    collection = JSON.parse(localStorage.getItem(currentUser));

    // remove image from collection
    delete collection[image];

    // update localstorage
    localStorage.setItem(currentUser, JSON.stringify(collection));

    // reload Collection
    // FIXME: only remove single image don't reload entire collection
    showCollection();

    //TODO: Notify User Image was removed on webpage.
}

/**
 * Generate HTML for Collection
 * Add Collection to page
 */
const showCollection = () => {
    
    // Get Collection for current user from Storage
    let collection = JSON.parse(localStorage.getItem(currentUser));
    
    if (!localStorage.getItem(currentUser) || JSON.parse(localStorage.getItem(currentUser)).length == 0) {
        // TODO: Display Notification to User on Page
        return console.log(`No Collection found for Current User`);
    }

    // Generate Collection Items
    let collectionItems = [];

    Object.entries(collection).forEach(([key, val]) => {
        // TODO: Look at ways to make this code easier to read
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

        collectionItems.push(itemLi);
    });

    // Add Collection Items to webpage.
    const collectionList = document.querySelector(".collection-list");
    collectionList.replaceChildren(...collectionItems);
}

/**
 * Get user list from local storage
 */
const getUserList = () => {
    if (!localStorage.getItem("userList")) {
        console.log(`error: No userList Found`);
        let userList = ["guest"];
        localStorage.setItem("userList", JSON.stringify(userList));
    } 
    return JSON.parse(localStorage.getItem("userList"));
}

/**
 * update options for user list selection
 */
const listUsers = () => {
    let userList = getUserList();

    let options = document.querySelector("#switch-user");

    for ( i = 0; i < userList.length; i++) {
        let option = document.createElement("option");
        option.value = userList[i];
        option.text = userList[i];
        options.add(option);
    }
}

/**
 * Switch Current user
 * Update headers, Show New Collection
 */
const switchUser = (userName) => {

    const userLabel = document.querySelector(".site-header span.user");

    // set currentUser to new user
    currentUser = userName;
    localStorage.setItem("currentUser", currentUser);

    // switch header to new user
    userLabel.textContent = currentUser;
    
    // load new collection
    showCollection();
}


/**
 * New User Form handler
 */
const formSubmitNew = (event) => {
    event.preventDefault();

    // Get Username
    username = formNewUser.querySelector("#new-email").value;
    
    // Get User List
    userList = getUserList();

    // Check if User exists
    //TODO: Display Error to User on page
    if (userList.includes(username)) {
        return console.log("Error: User Already Exists!");
    }

    // Add New User to userlist
    userList.push(username);

    // Update Local Storage
    localStorage.setItem("userList", JSON.stringify(userList));

    // Update User Selection Options
    let options = document.querySelector("#switch-user");
    let option = document.createElement("option");
    option.value = username;
    option.text = username;
    options.add(option);

    // Reset New User Field
    formNewUser.querySelector("#new-email").value = " ";

    // Perform User Switch
    switchUser(username);

    //close dialog
    dialogNewUser.close();

    //notify user of success
    // TODO: Display Notification to User on Page
}

/**
 * Switch User Form Handler
 */
const formSubmitSwitch = (event) => {
    event.preventDefault();

    //grab form input for new user name
    let username = formSwitchUser.querySelector("#switch-user").value;
    console.log(username);

    // Perform User Switch
    switchUser(username);

    // close dialog
    dialogSwitchUser.close();

    // notify user of success
    // TODO: Display Notification to User on Page
}

/**
 * Webpage On Load Initialisation
 */
const onLoadHandler = () => {
    listUsers();
    randomImage();

    let currentUser = localStorage.getItem('currentUser') === null ? "guest" : localStorage.getItem('currentUser');
    switchUser(currentUser);
}

/****
 ** Events
 ****/

// Image Controls Events
const imageRandomButton = document.querySelector(".image-new");
const imageAddButton = document.querySelector(".image-add");
imageRandomButton.addEventListener("click", randomImage);
imageAddButton.addEventListener("click", addImage);

// Collection Events
const collectionRemoveButton = document.querySelector(".collection-list");
collectionRemoveButton.addEventListener("click", removeImage);

// New User Dialog Events
const dialogNewUser = document.querySelector("#dialog-new");
const buttonNewOpen = document.querySelector("#button-new-open");
const buttonNewClose = document.querySelector("#button-new-close");
const formNewUser = document.querySelector("#form-new");
const buttonNewSubmit = document.querySelector("#button-new-submit");
buttonNewOpen.addEventListener("click", () => dialogNewUser.showModal());
buttonNewClose.addEventListener("click", () => dialogNewUser.close());
buttonNewSubmit.addEventListener("click", formSubmitNew);

// Switch User Dialog Events
const dialogSwitchUser = document.querySelector("#dialog-switch");
const buttonSwitchOpen = document.querySelector("#button-switch-open");
const buttonSwitchClose = document.querySelector("#button-switch-close");
const formSwitchUser = document.querySelector("#form-switch");
const buttonSwitchSubmit = document.querySelector("#button-switch-submit");
buttonSwitchOpen.addEventListener("click", () => dialogSwitchUser.showModal());
buttonSwitchClose.addEventListener("click", () => dialogSwitchUser.close());
buttonSwitchSubmit.addEventListener("click", formSubmitSwitch);

// On Load Events
document.addEventListener('DOMContentLoaded', onLoadHandler);