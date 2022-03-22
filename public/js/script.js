var imgInput = document.getElementById("imageFile");
var contentInput = document.getElementById("content");

var form = document.getElementById('postForm');


form.addEventListener('onsubmut', function (event) {
    event.preventDefault();
});

document.getElementById('btn').addEventListener('click', function () {

    if (contentInput.value !== '' || imgInput.value !== '') {
        doRequest('POST', '/upload', imgInput.value != null ? imgInput : undefined,
            contentInput.value ? contentInput : undefined 
        )
    } else {
        alert('Please add content or image');
    }
    // form.submit();
    contentInput.value = '';
    imgInput.value = '';
});


function doRequest(method, url, imgInput, contentInput) {
    let formData = new FormData();
    let xhttp = new XMLHttpRequest();
    
    if (imgInput && imgInput.value) {
        formData.set(imgInput.name, imgInput.files[0], imgInput.files[0].name);
    
        xhttp.open(method, url, true);
        xhttp.send(formData);
    }

    if (contentInput && contentInput.value) {
        formData.set(contentInput.name, contentInput.value);        
    
        xhttp.open(method, url, true);
        xhttp.send(formData);
    
    }
        

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(xhttp.response);

            if (res.avatarUrl) {
                createImageElement(res.avatarUrl);
            } else if (res.content || res.imageUrl || res.avatarUrl) {
                res.imageUrl ? createImageElementPost(res.imageUrl) : null;
                res.content ? createParaElement(res.content) : null;
                res.avatarUrl ? createImageElement(res.avatarUrl) : null;
            } else if (res.status) {
                    createErrorElement();
            }
        }
    }
}

function createParaElement(res) {

    let tag = document.createElement('p');
    tag.innerHTML = res;
    const cardContainer = document.getElementById('target1');
    cardContainer.append(tag);
    tag.before(document.getElementById('target2'));


}

function createErrorElement() {
    if (document.getElementById('dynamic-image')) {
        document.getElementById('dynamic-image').remove();
    }

    let tag = document.createElement('p');
    tag.innerHTML = 'Error uploading image';
    let card = document.getElementById('target');
    card.append(tag);

}

function createImageElementPost(name) {
    if (document.getElementById('dynamic-image')) {
        document.getElementById('dynamic-image').remove();
    }
    let path = `../images/${name}`;

    const tag = document.createElement('img');

    tag.setAttribute('src', path);
    tag.setAttribute('id', 'dynamic-image');
    tag.style.width = '100%';
    const cardContainer = document.getElementById('target1');
    cardContainer.append(tag);
    tag.before(document.getElementById('target2'));
}

function createImageElement(name) {
    if (document.getElementById('dynamic-image')) {
        document.getElementById('dynamic-image').remove();
    }
    let path = `../images/${name}`;

    const tag = document.createElement('img');

    tag.setAttribute('src', path);
    tag.setAttribute('id', 'dynamic-image');
    tag.style.width = '100%';
    const card = document.getElementById('target');
    card.append(tag);
}

imgInput.addEventListener('change', function () {
    if (imgInput.value) {
        doRequest('POST', '/uploadpreview', imgInput);
    }

});
 
function openWindow() {
    imgInput.click();
}




