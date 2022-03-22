
document.getElementById('btn').addEventListener('click', function () {
    let form = document.getElementById('postForm');
    form.submit();
});

var count = 0;
var imgInput = document.getElementById("imageFile");

function doRequest() {
    let formData = new FormData();
    
    formData.set(imgInput.name, imgInput.files[0], imgInput.files[0].name);
        
    let xhttp = new XMLHttpRequest();

    xhttp.open('POST', '/uploadpreview', true);
    xhttp.send(formData);

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let res = xhttp.response;

            if (xhttp.response ===
                '{"status":false,"message":"No file uploaded"}') {
                    createErrorElement();
            }
            createElement(res);
        }
    }
}

function createErrorElement() {
    if (document.getElementById('dynamic-image')) {
        document.getElementById('dynamic-image').remove();
    }

    let tag = document.createElement('p');
    p.innerHTML = 'Error uploading image';
    let card = document.getElementById('target');
    card.append(tag);

}

function createElement(name) {
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
        doRequest();
    }

});
 
function openWindow() {
    imgInput.click();
}




