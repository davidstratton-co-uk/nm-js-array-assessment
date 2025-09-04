/****
 ** Config
 ****/
const limit = 200;
const url = `https://picsum.photos/v2/list?limit=${limit}`;

/****
 ** Utilities
 ****/

/**
 * Generate Notification with timed removal
 */
const displayNotification = (type, msg) => {

    const notifications = document.querySelector(".notifications");

    let div = document.createElement("div");
    div.classList.add(`notification--${type}`);

    let para = document.createElement("p");
    para.textContent = `${msg}`;
    div.append(para);

    let strong = document.createElement("strong");
    strong.textContent = `${type}`;
    para.prepend(strong);

    let span = document.createElement("span");
    span.textContent = `: `;
    strong.append(span);

    notifications.appendChild(div);

    setTimeout(function() {
        div.remove();
     }, 5000);
}

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
    number = Math.round(Math.random () * limit);
    let currentImage = document.querySelector(".image-current").firstElementChild;

    let image = document.createElement("img");
    image.setAttribute("src", data[number].download_url);
    image.setAttribute("alt", " ");
    image.setAttribute("data-id", data[number].id );
    
    currentImage.replaceWith(image);
    let currentImageData = data[number];
    return currentImageData;
}

/**
 * Check if Image List is in local storage if not fetch list from api
 */
const randomImage = () => {

    
    if (localStorage.getItem('imageList')) {
        let imageList = JSON.parse(localStorage.getItem('imageList'));

        // TODO: Local Storage Expiration
        // TODO: Check if imageList is the same size as current limit

        currentImageData = generateImage(imageList);
        return currentImageData;
    }

    fetchImageList(url)
        .then(data => {
            localStorage.setItem('imageList', JSON.stringify(data));
            currentImageData = generateImage(data);
            return currentImageData;
        }
    );
}

/**
 * Add Image to users collection
 * Update collection in local storage
 */
const addImage = () => {

let imageList = JSON.parse(localStorage.getItem('imageList'));

let ImageData = currentImageData;

    let collection = {};

    if (localStorage.getItem(currentUser)) {
        collection = JSON.parse(localStorage.getItem(currentUser));
    }

    if (ImageData.id in collection) {
        return displayNotification("error", "Image Not Added - Already Exists in Collection!")
    }

    // Update Collection
    collection[ImageData.id] = ImageData;
    localStorage.setItem(currentUser, JSON.stringify(collection));

    // reload Collection
    // FIXME: only add single image don't reload entire collection
    showCollection();

    // display notification
    displayNotification("success", `Image Added to Collection`)
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

    // display notification
    displayNotification("success", `Image was removed from collection!`)
}

/**
 * Generate HTML for Collection
 * Add Collection to page
 */
const showCollection = () => {
    
    let collection = {};

    // Get Collection for current user from Storage
    if (localStorage.getItem(currentUser)) {
        collection = JSON.parse(localStorage.getItem(currentUser));
    }
    
    // Generate Collection Items
    let collectionItems = [];

    Object.entries(collection).forEach(([key, val]) => {
        // FIXME: Look at ways to make this code easier to read
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
        itemIcon.classList.add("fa-solid", "fa-x");
        
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

    let select = document.querySelector("#switch-user");
    let options = [];

    // Generate Options
    for ( i = 0; i < userList.length; i++) {
        let option = document.createElement("option");
        option.value = userList[i];
        option.text = userList[i];
        options.push(option);
    }

    select.replaceChildren(...options);
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
 * Display Form Rrror
 * 
 */
const displayFormError = (errorMsg) => {
    console.log(errorMsg);
}

/**
 * E-Mail Validation
 * 
 */
const isValidEmail = (email) => {

    if (email.trim().length == 0 ) { 
        displayFormError("E-mail can not be blank");
        return false;
    }

    if (email.startsWith(".")) {
        displayFormError("E-mail can not start with .");
        return false;
    }
    
    const validEmail = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
    const validEmailStart = new RegExp(/^[A-Z0-9._%+-]+@/i);
    const validEmailDomain = new RegExp(/@[A-Z0-9.-]+\.[A-Z]{2,}$/i);

    // Perform Full E-mail Validation  
    if (validEmail.test(email)) {
        return true;
    }

    // Define Specific Error
    if (!email.includes("@")) {
        displayFormError("E-mail must contain an @");
        return false;
    }

    if (!email.includes(".")) {
        displayFormError("E-mail must contain an .");
        return false;
    }

    if (!validEmailStart.test(email)) {
        displayFormError("E-mail must contain at least one letter before the @ symbol");
        return false;
    }

    if (!validEmailDomain.test(email)) {
        displayFormError("E-mail must contain a valid domain");
        return false;
    }

    // Safety Catch-All
    displayFormError("E-mail is not valid");
    return false;
}
 
/**
 * New User Form handler
 */
const formSubmitNew = (event) => {
    event.preventDefault();

    // Get Username
    email = formNewUser.querySelector("#new-email").value;
    // Get User List
    userList = getUserList();

    // Check if User exists
    if (userList.includes(email)) {
        return displayFormError(`User already exists`);
    }

    if (!isValidEmail(email)) {
        return;
    }

    // Add New User to userlist
    userList.push(email);

    // Update Local Storage
    localStorage.setItem("userList", JSON.stringify(userList));

    // Update User Selection Options
    let options = document.querySelector("#switch-user");
    let option = document.createElement("option");
    option.value = email;
    option.text = email;
    options.add(option);

    // Reset New User Field
    formNewUser.querySelector("#new-email").value = " ";

    // Perform User Switch
    switchUser(email);

    //close dialog
    dialogNewUser.close();

    //notify user of success
    displayNotification("success", `${email} has been successfully added.`)
}

/**
 * Switch User Form Handler
 */
const formSubmitSwitch = (event) => {
    event.preventDefault();

    //grab form input for new user name
    let username = formSwitchUser.querySelector("#switch-user").value;

    // Perform User Switch
    switchUser(username);

    // close dialog
    dialogSwitchUser.close();

    // notify user of success
    displayNotification("success", `Current User Switched to ${username}`)
}

/**
 * Delete User Form Handler
 */
const formSubmitDel = (event) => {
    event.preventDefault();

    //grab form input for new user name
    let username = formSwitchUser.querySelector("#switch-user").value;

    if (currentUser === username) {
        switchUser("guest");
    }

    // Get User List
    userList = getUserList();

    // Perform User Deletion
    userList = userList.filter(user => user !== username);
    localStorage.removeItem(username);
    localStorage.setItem("userList", JSON.stringify(userList));

    // Refresh User Switch Options
    listUsers();

    // close dialog
    dialogSwitchUser.close();

    // notify user of success
    displayNotification("success", `${username} has been deleted`)

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
buttonNewOpen.addEventListener("click", () => dialogNewUser.showModal());
buttonNewClose.addEventListener("click", () => dialogNewUser.close());
formNewUser.addEventListener("submit", formSubmitNew);

// Switch User Dialog Events
const dialogSwitchUser = document.querySelector("#dialog-switch");
const buttonSwitchOpen = document.querySelector("#button-switch-open");
const buttonSwitchClose = document.querySelector("#button-switch-close");
const formSwitchUser = document.querySelector("#form-switch");
const buttonDelUser = document.querySelector("#button-del-submit");
buttonSwitchOpen.addEventListener("click", () => dialogSwitchUser.showModal());
buttonSwitchClose.addEventListener("click", () => dialogSwitchUser.close());
formSwitchUser.addEventListener("submit", formSubmitSwitch);
buttonDelUser.addEventListener("click", formSubmitDel);

// On Load Events
document.addEventListener('DOMContentLoaded', onLoadHandler);