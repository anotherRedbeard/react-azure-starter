import config from './config';

export async function getPipelineSystems() {
    var systems = [];
    var url = config.lagoonApiUrl + 'enterprise/pipelinesystem?code=' + config.lagoonApiCode;
    var resp = await fetch(url);
    systems = await resp.json();
    return systems;
}

export async function getFacilities() {
    var facilities = [];
    var url = config.lagoonApiUrl + 'enterprise/facility?code=' + config.lagoonApiCode;
    var resp = await fetch(url);
    facilities = await resp.json();
    return facilities;
}

export async function getPosts() {
    var posts = [];
    console.log('url',config);
    var url = config.jsonApiUrl + '/posts';
    var resp = await fetch(url);
    console.log('getPosts',resp);
    posts = await resp.json();
    console.log('getPosts',posts);
    return posts;
}

export async function upsertPipelineSystem(system) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(system)
    };
    var url = config.lagoonApiUrl + 'enterprise/pipelinesystem?code=' + config.lagoonApiCode;
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

export async function upsertFacilities(facilities) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facilities)
    };
    var url = config.lagoonApiUrl + 'enterprise/facility?code=' + config.lagoonApiCode;
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