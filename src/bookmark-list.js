import $ from 'jquery'
import store from './store'
import api from './api';

// HTML Strings ****************************************************************

const generateTopElement = function () {
    return `<h1>Bookmarks</h1>
        <div class="bookmark-container">
            <div class="add-and-filter">
                <button class="add button-style">Add</button>
                <div class="dropdown">
                    <button class="filter button-style">Filter</button>
                    <div class="dropdown-content">
                        <p class="number-filter button-style">1</p>
                        <p class="number-filter button-style">2</p>
                        <p class="number-filter button-style">3</p>
                        <p class="number-filter button-style">4</p>
                        <p class="number-filter button-style">5</p>
                    </div>
                </div>
            </div>
            <div class="bookmark-storage">
            </div>
        </div>`
}

const generateItemElement = function (item) {
    if (item.expanded === false) {
        return ` <div data-id="${item.id}" class="page condensed">
                <div class="rating align">
                <h4>${item.title}</h4>
                <p class="ofFive">Rating ${item.rating}/5</p>
                </div>
                </div>`;
    } else {
        return `<div data-id="${item.id}" class="page">
                <div class="rating">
                <div class ="purple">
                <i class="fa fa-trash delete"></i>
                </div>
                <div class="rating align">
                <h4>${item.title}</h4>
                <p class="ofFive">Rating ${item.rating}/5</p>
                </div>
                </div>
                    <div class="visit-desc">
                    <div class='center'>
                    <a class="button-style" href="${item.url}" target="_blank">Visit!</a>
                    </div>
                    <div class="disc-box">
                    <p>${item.desc}</p>
                    </div>
                    </div>
                </div>`;
    }
}

const reviewAddButtonHtml = function () {
    return `<form class="bookmark-submit">
            <label for='url'>What do you call this link?</label><br />
            <input type='text' id='title' name='title' /><br />
            <label for='name'>Add the link here! (start with https://)</label><br />
            <input type='text' id='url' name='url' /><br />
            <label for='desc'>Description</label><br />
            <input type='text' id='desc' name='desc' /><br />
            <label for='email'>Rating</label><br />
            <input type='number' id='rating' name='rating' min='1' max='5'/><br />

            <button type='submit' class="submit new-bookmark button-style">Submit</button>
            </form>
            <div class="visit-desc">
            <div class='center'>
            <button class='cancel button-style'>Cancel</button>
            </div>
            <div>`
}

// EVENT SUPPORT *******************************************************

const extractID = function (target) {
    return $(target).data('id');
}

const createHtmlString = function (bookmarks) {
    //take items from the store's bookmarks and turn them into
    //usable html code
    if (bookmarks.length === 1) {
        return generateItemElement(bookmarks[0]);
    }
    const items = bookmarks.map(item => generateItemElement(item));
    return items.join('');
}

// EVENTS ***************************************************************

const handleBookmarkSubmit = function () {
    //When the user clicks submit, grab all the values to create an object
    //that will go into the store module
    $('main').on('submit', '.bookmark-submit', e => {
        e.preventDefault();

        let title = $(e.currentTarget).find('#title').val();
        let url = $(e.currentTarget).find('#url').val();
        let desc = $(e.currentTarget).find('#desc').val();
        let rating = $(e.currentTarget).find('#rating').val();

        api.createBookmark(title, url, desc, rating)
            .then(newBookmark => {
                store.createItem(newBookmark);
                store.adding = false;
                render();
            })
            .catch((err) => {
                alert(err.message);
            });
    });
}

const handleDeleteClicked = function () {
    //When the user clicks the trashcan, we need to remove the item
    //then render

    $('main').on('click', '.delete', e => {
        let target = $(e.currentTarget).closest('.page')
        let selectedBookmarkID = extractID(target);

        api.removeBookmark(selectedBookmarkID)
            .then(() => {
                store.removeItem(selectedBookmarkID);
                render();
            })
            .catch(err => {
                alert(err.message);
            })
    });
}

const handleCancelClicked = function () {
    //THis is so the user can back out of making hte
    //new bookmark for whatever reason back to the
    //starting page
    $('main').on('click', '.cancel', e => {
        store.changeAddNew();
        render();
    });
}

const handleAddClicked = function () {
    //if someone clicks on this add, load the page that will allow
    //users to add a new page
    $('main').on('click', '.add', e => {
        store.changeAddNew();
        render();
    });
}

const handleCondensedClicked = function () {
    //If someone clicks in the box of bookmarks then change the style of the div
    //to and expanded version that then details more information
    $('main').on('click', '.condensed', e => {
        let selectedBookmarkID = extractID(e.currentTarget);
        store.toggleExpanded(selectedBookmarkID);

        render();
    });
}

const handleFilterClicked = function () {
    //When this is clicked, filter the array by the rating
    $('main').on('click', '.number-filter', e => {
        let filter = $(e.currentTarget).html();
        store.filterBookmarks(filter);
        render();
    })
}

const render = function () {
    let htmlString = ''
    let topString = generateTopElement();

    if (store.adding === true) {
        htmlString = reviewAddButtonHtml()
    } else {
        let bookmarks = store.bookmarks.filter(currentItem => {
            return currentItem.rating >= store.filter;
        });

        htmlString = createHtmlString(bookmarks);
    }

    $('main').html(topString);
    $('.bookmark-storage').html(htmlString);
}

const bindEventListeners = function () {
    handleCancelClicked();
    handleAddClicked();
    handleCondensedClicked();
    handleDeleteClicked();
    handleBookmarkSubmit();
    handleFilterClicked();
}

export default {
    bindEventListeners, render
}