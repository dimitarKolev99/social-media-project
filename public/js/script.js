
document.getElementById('btn').addEventListener('click', function () {
    let form = document.getElementById('postForm');
    form.submit();
});


async function doRequest() {
    let imgInput = document.getElementById("imageFile");
    let formData = new FormData();
    formData.append(imgInput.name, imgInput.files[0], imgInput.files[0].name);

    
    let count;
    for (let pair of formData.entries()) {
        count++;
        console.log(count);
    }
    
    if (count > 1) {
        console.log('YES');
        formData.delete(imgInput.name);
        formData.append(imgInput.name, imgInput.files[0], imgInput.files[0].name);
    } 
    
    let xhttp = new XMLHttpRequest();

    xhttp.open('POST', '/uploadpreview', true);
    xhttp.send(formData);

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let res = xhttp.response;
            createElement(res);
        }
    }

    xhttp.onload = function () {
        if (xhttp.status == 200) {
            // console.log('HI');
        } else {
            console.log('status not 200');
        }
      };

}

function createElement(name) {
    if (document.getElementById('dynamic-image')) {
        document.getElementById('dynamic-image').remove();
    }
    let path = `../images/${name}`;

    const tag = document.createElement('img');

    tag.setAttribute('src', path);
    tag.setAttribute('id', 'dynamic-image');
    tag.style.width = '300px';
    const card = document.getElementById('target');
    card.append(tag);
}
 
function openWindow() {
    let imgInput = document.getElementById("imageFile");
    imgInput.click();

    imgInput.addEventListener('change', async function () {
        if (imgInput.value) {
            doRequest();
        }

    });
    
}




