/**
 * sends a request to the specified url from a form. this will change the window location.
 * @param {string} path the path to send the post request to
 * @param {object} params the parameters to add to the url
 * @param {string} [method=post] the method to use on the form
 */


function post(path, params, method = 'post') {

    // The rest of this code assumes you are not using a library.
    // It can be made less verbose if you use one.
    const form = document.createElement('form');
    form.method = method;
    form.action = path;

    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = params[key];

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}



function init() {
/*     const formElem = document.getElementById('formElem');
    formElem.addEventListener('submit', (e) => {
        // e.preventDefault();
        console.log('Event listener Submit')
    });
 */  
    // formElem.onsubmit = doForm();
    
}


function doForm() {
    console.log('HERE');
    var data = new FormData();
    data.append('text', document.getElementById('content').value);
    data.append('file', document.getElementById('imageFile').value);

    var a = {
        text: "",
        file: "",
    };

    for (let [k, v] of data.entries()) {
        if (k == 'text') {
            a.text = v;
        }
        if (k == 'file') {
            a.file = v;
        }
    }
    post('/feed/create/', a);

}

document.addEventListener('DOMContentLoaded', (event) => {
    init();
});