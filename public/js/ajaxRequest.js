import { cardElProps, create, topLevel, tree, traverse } from './createElementTree.js';


function createImageElement(name, target) {
    if (document.getElementById('dynamic-image')) {
    
    document.querySelector('#dynamic-image').remove();
    
    } else if (document.getElementById('preview-img-p')) {
        document.getElementById('preview-img-p').remove();
    }

    
    let path = `../images/${name}`;
    let tag = document.createElement('img');

    
    tag.setAttribute('src', path);
    tag.setAttribute('id', 'dynamic-image');
    tag.style.width = '100%';
    
    target.append(tag);

}

function doRequest(method, url, imgInput, contentInput) {
    let formData = new FormData();
    let xhttp = new XMLHttpRequest();

    if (imgInput != null && imgInput.value != '' || contentInput != '') {
        imgInput != null && imgInput.value != '' ? 
        formData.set(imgInput.name, imgInput.files[0], imgInput.files[0].name) : null;
        contentInput != '' ? formData.set('content', contentInput) : null;

        xhttp.open(method, url, true);
        xhttp.send(formData);
    }

    /*  if (contentInput) {
         formData.set(contentInput.name, contentInput.value);
 
         xhttp.open(method, url, true);
         xhttp.send(formData);
 
     } */


    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(xhttp.response);

            if (res.avatarUrl) {
                let target = document.getElementById('preview-img');
                createImageElement(res.avatarUrl, target);
            } else if (res.content || res.imageUrl) {
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
     */        }
    }
}

export { doRequest };
