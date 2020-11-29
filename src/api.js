const baseUrl = 'https://thinkful-list-api.herokuapp.com/IanBruns/bookmarks'

/**
 * listApiFetch - Wrapper function for native `fetch` to standardize error handling.
 * @param {string} url
 * @param {object} options
 * @returns {Promise} - resolve on all 2xx responses with JSON body
 *                    - reject on non-2xx and non-JSON response with
 *                      Object { code: Number, message: String }
 */

const listApiFetch = function (...args) {
    //function for fetching from the api, with error handling
    let err;

    return fetch(...args)
        .then(res => {
            if (!res.ok) {
                err = { code: res.status };

                if (!res.headers.get('content-type').includes('json')) {
                    err.message = res.statusText;
                    return Promise.reject(err);
                }
            }
            return res.json();
        })
        .then(data => {
            if (err) {
                err.message = data.message;
                return Promise.reject(err);
            }
            return data;
        });
}

const getBookmarks = function () {
    return listApiFetch(baseUrl);
}

const removeBookmark = function (id) {
    return listApiFetch(baseUrl + '/' + id, {
        method: 'DELETE'
    });
}

const createBookmark = function (title, url, desc, rating) {
    let newBookmark = JSON.stringify({ title, url, desc, rating });
    return listApiFetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: newBookmark
    });
}

export default {
    getBookmarks,
    createBookmark,
    removeBookmark
}