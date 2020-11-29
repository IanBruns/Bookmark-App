import $ from 'jquery';

import './index.css';
import bookmarkList from './bookmark-list';
import api from './api';
import store from './store';

function main() {
    api.getBookmarks()
        .then((bookmarks) => {
            bookmarks.forEach((bookmark) => store.createItem(bookmark));
            bookmarkList.render();
        });
    bookmarkList.bindEventListeners();
    bookmarkList.render();
}

$(main);