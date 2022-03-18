

document.getElementById('btn').addEventListener('click', function() {
     let form = document.getElementById('postForm');
/*     let content = document.getElementById('content');
    let img = document.getElementById('imageFile');

    let formData = new FormData(); 
    formData.append(content.name, content.value);
    formData.append(img.name, img.value);
 */ 
    /*     let object = {
        content: content,
        img: img,
    };
 */    // console.log(`Content: ${content} Image: ${img}`);
    // doRequest(formData);
    form.submit();
});

function doRequest(o) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            create(xhttp.responseText);
        }
    }

    xhttp.open('POST', '/make', true);
    // xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(o);
}

function create(resTex) {
    let target = document.getElementById('con');
    let el = document.createElement('h1');
    let text = document.createTextNode(resTex);
    el.appendChild(text);
    target.prepend(el);


}


function do2(){
    let imgInput = document.getElementById("imageFile");
    imgInput.click();
}


 
