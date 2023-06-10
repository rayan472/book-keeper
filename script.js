const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('modal-close');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEL = document.getElementById('website-name');
const websiteUrlEL = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// Show modal, focus on Input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEL.focus();
}

// Modal event listener
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

// Validate form
function Validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert('please submit values for both fields');
        return false;
    }
    if (!urlValue.match(regex)) {
        alert('provide a valid web address');
        return false;
    }
    // Valid
    return true;
}

// Build Bookmarks DOM
function buildBookmarks() {
    // Remove all bookmarks element
    bookmarksContainer.textContent = '';
    // Build Items
    bookmarks.forEach((bookmark) => {
        const { name, url } = bookmark;
    // item 
    const item = document.createElement('div');
    item.classList.add('item');
    // Close Icon
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-times');
    closeIcon.setAttribute('title', 'deleteBookmark');
    closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
   // Favicon / Link Container
   const linkInfo = document.createElement('div');
   linkInfo.classList.add('name');
   // favicon
   const favicon = document.createElement('img');
   favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
   favicon.setAttribute('alt', 'favicon');
   // Link
   const link = document.createElement('a');
   link.setAttribute('href', `${url}`);
   link.setAttribute('target', '_blank');
   link.textContent = name;
   // Append to bookmarks container
   linkInfo.append(favicon, link);
   item.append(closeIcon, linkInfo);
   bookmarksContainer.appendChild(item);
    });
}

// Fetch bookmarks
function fetchBookmarks() {
    // Get bookmarks from localstorage if available
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // Create bookmarks array in localstorage
        bookmarks = [
            {
                name: 'Jacinto Design',
                url: 'https://jacinto.design',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

 // Delete Bookmark
 function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
       if (bookmark.url === url) {
        bookmarks.splice(i,1);
       }
    });
    // Update bookmark array in localstorage, re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
 }
  
// Handle data from form
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEL.value;
    let urlValue = websiteUrlEL.value;
    if (!urlValue.includes('https://', 'https://')) {
        urlValue = `https://${urlValue}`;
    }
    if (!Validate(nameValue, urlValue)) {
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEL.focus();
}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

// On load fetch bookmarks
fetchBookmarks();
