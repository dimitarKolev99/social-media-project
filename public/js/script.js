import { cardElProps, create, topLevel, tree, traverse } from './createElementTree.js';
import { doRequest } from './ajaxRequest.js';


var imgInput = document.getElementById("imageFile");
var contentInput = document.getElementById("content");
var textarea = document.querySelector('#content-input-textarea');
var form = document.getElementById('postForm');


imgInput.addEventListener('change', function () {
    if (imgInput.value) {
        doRequest('POST', '/uploadpreview', imgInput);
    }

});

form.addEventListener('onsubmut', function (event) {
    event.preventDefault();
});

document.querySelector('#preview-img').addEventListener('click', () => {    
    openWindow();   
});

document.getElementById('btn').addEventListener('click', function () {

    let modal = document.querySelector('.post-modal');
    if (modal.getAttribute('is-open') === 'true') {
        modal.setAttribute('is-open', 'false');
    }

    if (textarea.textContent !== '' || imgInput.value !== '') {
        doRequest('POST', '/upload', imgInput.value != null ? imgInput : undefined,
            textarea.textContent
        ) 
    } else {
        alert('Please add content or image');
    }

 /*    if (contentInput.value !== '' || imgInput.value !== '') {
        doRequest('POST', '/upload', imgInput.value != null ? imgInput : undefined,
            contentInput.value ? contentInput : undefined
        ) 
    } else {
        alert('Please add content or image');
    } */
    contentInput.value = '';
    imgInput.value = '';
});


/* function doRequest(method, url, imgInput, contentInput) {
    let formData = new FormData();
    let xhttp = new XMLHttpRequest();

    if (imgInput && imgInput.value && contentInput != '') {
        formData.set(imgInput.name, imgInput.files[0], imgInput.files[0].name);
        formData.set('content', contentInput);        

        xhttp.open(method, url, true);
        xhttp.send(formData);
    }

     if (contentInput) {
        formData.set(contentInput.name, contentInput.value);

        xhttp.open(method, url, true);
        xhttp.send(formData);

    } 


    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(xhttp.response);

            if (res.avatarUrl) {
                let target = document.getElementById('preview-img');
                createImageElement(res.avatarUrl, target);
            } else if (res.content && res.imageUrl) {
                console.log('YOU CALLED ME');
                let data = cardElProps(res.user, res.content, res.imageUrl);
                tree(data);
            }
            /*  if (res.content && res.imageUrl) {
                let parentNode = document.getElementById('target2').parentNode;
                let sp2 = document.getElementById('target2');
                parentNode.insertBefore(createCard(res.user._id, res.user.imageUrl,
                    res.user.username, res.content, res.imageUrl), sp2);
            } */

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
      }
    }
} */




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


function openWindow() {
    imgInput.click();
}


///////////////////////////

/* const cardElProps = function(user, content, imageUrl) {
    return [
        {
            id: 1,
            parent_id: null,
            type: 'div',
            attributes: { 'class': 'card' },
            mount: document.querySelector('#target2'),
        },
        {
            id: 2,
            parent_id: 1,
            type: 'div',
            attributes: { class: 'flex-row', id: 'card-header' },
            mount: '',
        },
        {
            id: 3,
            parent_id: 2,
            type: 'a',
            attributes: { href: `/profile/${user._id}` },
        },
        {
            id: 4,
            parent_id: 3,
            type: 'img',
            attributes: {
                class: "avatar", 
                alt: "user profile picture",
                src: `${user.imageUrl}`,
            },
        },
        {
            id: 5,
            parent_id: 2,
            type: 'a',
            attributes: { class: 'name', href: `${user._id}` },
            innerHTML: `${user.username}`,
        },
        {
            id: 6,
            parent_id: 1,
            type: 'p',
            attributes: { style: "margin-left: 1.4rem;" },
            innerHTML: `${content}`,
        },
        {
            id: 7,
            parent_id: 1,
            type: 'img',
            attributes: {
                style: "border-top: 1px solid rgba(0, 0, 0, 0.116); border-bottom: 1px solid rgba(0, 0, 0, 0.116);",
                src: `${imageUrl}`, width: "100%", alt: "post photo"
            },
        }];
    
} 

function create(type, properties, appendTarget, beforeNode, innerHTML) {
    let el = document.createElement(type);
    for (let key in properties) {
        el.setAttribute(key.toString(), properties[key].toString());
    }

    if (appendTarget != undefined) {
        appendTarget.appendChild(el);
    } else if (beforeNode != undefined) {
        beforeNode.parentNode.insertBefore(el, beforeNode);
    } else if (innerHTML != null) {
        el.innerHTML = innerHTML;
    }

    return el;
}

function topLevel(data) {
    const filter = data.filter(node => !node.parent_id);
    filter.forEach(each => {
        each.element = create(each.type, each.attributes, null, each.mount);
    });

    return filter;
}

function tree(data) {
    return topLevel(data).map(each => {
        traverse(data, each.id).forEach(el => {
            each.element.appendChild(el);

        });

        return each;
    });
}

function traverse(data, parentId) {
    const children = data.filter(each => each.parent_id === parentId);
    children.forEach(child => {
        child.element = create(child.type, child.attributes, null, null,
            child.innerHTML ? child.innerHTML : null);

        traverse(data, child.id).forEach(el => {
            child.element.appendChild(el);

        });
    });
    let arrayEls = [];
    children.map(each => {
        arrayEls.push(each.element);
    });
    return arrayEls;
}
 */


// let y = create('div', { src: '/', width: '500px', style: 'background-color: rgba(0,0,0,1);' }, undefined, document.querySelector('#target2'));
// let x = create('img', { src: '/', width: '300px' }, y);


//  createCard(123);


function createCard(profileUrl, profilePicUrl, username, content, postPicUrl) {
    let target = document.querySelector('#target2');
    
     
    
    create('a', { href: `/profile/${profileUrl}`}, 
    create('div', { class: 'flex-row', id: 'card-header' }, 
    create('div', { class: 'card' }, undefined, target)));
    // create('div', { class: 'flex-row', id: 'card-header' }, create('div', { class: 'card' }, undefined, target));

    
/*     const card = document.createElement('div');
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
 */}

