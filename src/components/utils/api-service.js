import config from './config';

export async function getPosts() {
    var posts = [];
    var url = config.jsonApiUrl + 'posts';
    var resp = await fetch(url);
    posts = await resp.json();
    return posts;
}

export async function getUsers() {
    var users = [];
    var url = config.jsonApiUrl + 'users';
    var resp = await fetch(url);
    users = await resp.json();
    return users;
}

export async function createPost(post) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(post)
    };
    var url = config.jsonApiUrl + 'posts';
    return fetch(url, requestOptions)
        .then(async response => {
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                const text = await response.text();
                const error = (text) || response.status;
                Promise.reject(error);
                throw error;
            }
        })
        .catch(error => {
            throw error;
        });
}

export async function updatePost(post) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(post)
    };
    var url = config.jsonApiUrl + 'posts/' + post.id;
    return fetch(url, requestOptions)
        .then(async response => {
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                const text = await response.text();
                const error = (text) || response.status;
                Promise.reject(error);
                throw error;
            }
        })
        .catch(error => {
            throw error;
        });
}