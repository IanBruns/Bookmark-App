const bookmarks = [];
let adding = false;
let error = null;
let filter = 0;

const changeAddNew = function () {
    this.adding = !this.adding;
}

const removeItem = function (id) {
    this.bookmarks = this.bookmarks.filter(currentItem => currentItem.id !== id);
}

const setError = function (err) {
    this.error = err;
}

const filterBookmarks = function (target) {
    this.filter = target;
}

const createItem = function (bookmark) {
    bookmark.expanded = false;
    bookmarks.push(bookmark);
}

const findByID = function (id) {
    return bookmarks.find(currentItem => currentItem.id === id);
}

const toggleExpanded = function (id) {
    bookmarks.map(currentItem => currentItem.expanded = false);
    let currentBookmark = findByID(id);
    currentBookmark.expanded = true;
}

export default {
    bookmarks,
    adding,
    error,
    filter,
    changeAddNew,
    removeItem,
    setError,
    filterBookmarks,
    createItem,
    findByID,
    toggleExpanded,
}