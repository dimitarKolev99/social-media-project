var imgInput = document.getElementById("imageFile");
var contentInput = document.getElementById("content");
var cardContainer = document.getElementById("target1");


var form = document.getElementById('postForm');


form.addEventListener('onsubmut', function (event) {
    event.preventDefault();
});

document.getElementById('btn').addEventListener('click', function () {

    
    /* let parentNode = document.getElementById('target2').parentNode;
    let sp2 = document.getElementById('target2');
    parentNode.insertBefore(createCard(), sp2); */


    if (contentInput.value !== '' || imgInput.value !== '') {
        doRequest('POST', '/upload', imgInput.value != null ? imgInput : undefined,
            contentInput.value ? contentInput : undefined
        ) 
    } else {
        alert('Please add content or image');
    }
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


    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(xhttp.response);


            if (res.content && res.imageUrl) {
                let parentNode = document.getElementById('target2').parentNode;
                let sp2 = document.getElementById('target2');
                parentNode.insertBefore(createCard(res.user._id, res.user.imageUrl,
                    res.user.username, res.content, res.imageUrl), sp2);
            }

/*             if (res.avatarUrl) {
                createImageElement(res.avatarUrl);
            } else if (res.content || res.imageUrl || res.avatarUrl) {
                res.imageUrl ? createImageElementPost(res.imageUrl) : null;
                res.content ? createParaElement(res.content) : null;
                res.avatarUrl ? createImageElement(res.avatarUrl) : null;
            } else if (res.content && res.imageUrl) {
                let parentNode = document.getElementById('target2').parentNode;
                let sp2 = document.getElementById('target2');
                parentNode.insertBefore(createCard('Blqt', 'nz',
                    'res.user.username', 'res.content', 'res.imageUrl'), sp2);
            } else if (res.status) {
                createErrorElement();
            }
 */        }
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

var card = function (user, post) {
    return `<div class="card">
    <div class="flex-row" id="card-header">
        <a href="/profile/${document.createTextNode(user)}">
            <img class="avatar" src="${document.createTextNode(user)}" 
            alt="user profile picture">                                
        </a>
        <a class="name" href="/profile/${document.createTextNode(user)}">
            ${document.createTextNode(user)}
        </a>
    </div>
    
        <p style="margin-left: 1.4rem;">
            ${document.createTextNode(post)}
        </p>
    
        <img style="border-top: 1px solid rgba(0, 0, 0, 0.116);
        border-bottom: 1px solid rgba(0, 0, 0, 0.116);" src="${document.createTextNode(post)}" width="100%" alt="post photo">
    </div>
    `;
}

///////////////////////////
function createCard(profileUrl, profilePicUrl, username, content, postPicUrl) {
    const card = document.createElement('div');
    card.setAttribute('class', 'card');
    const cardHeader = document.createElement('div');
    cardHeader.setAttribute('class', 'flex-row');
    cardHeader.setAttribute('id', 'card-header');
    card.append(cardHeader);

    const aImg = document.createElement('a');
    aImg.setAttribute('href', `/profile/${profileUrl}`); 

    cardHeader.append(aImg);

    const img = document.createElement('img');
    img.setAttribute('class', 'avatar');
    img.setAttribute('src', `${profilePicUrl}`);
    img.setAttribute('alt', 'user profile picture');


    aImg.append(img);

    const aImg2 = document.createElement('a');
    aImg2.setAttribute('href', `/profile/${profileUrl}`); //Append this to cardHeader
    aImg2.setAttribute('class', 'name');
    aImg2.innerText = `${username}`;

    cardHeader.append(aImg2);

    const para = document.createElement('p');
    para.innerText = `${content}`;
    para.style.marginLeft = '1.4rem';

    card.append(para);

    const img2 = document.createElement('img');
    img2.setAttribute('src', `${postPicUrl}`);
    img2.setAttribute('alt', 'post photo');
    img2.style.borderTop = '1px solid rgba(0, 0, 0, 0.116)';
    img2.style.borderBottom = '1px solid rgba(0, 0, 0, 0.116)';
    img2.style.width = '100%';

    card.append(img2);

    return card;
}

