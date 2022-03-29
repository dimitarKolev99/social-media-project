import { doRequest } from './ajaxRequest.js';

const inputField = document.querySelector('#content');
const modal = document.querySelector('.post-modal');
const picBtn = document.querySelector('#pic_upl_btn');
const picBtnX = document.querySelector('#pic_upl_btn-x');
const closePrev = document.querySelector('#close-prev');
const imgInput = document.getElementById("imageFile");

inputField.addEventListener('click', (e) => {
    e.preventDefault();
    
    modal.setAttribute('is-open', 'true');
    setFocus('.textarea');    
});

function setFocus(target) {
    document.querySelector(target).focus();
}
const closeBtn = document.querySelector('#close');
closeBtn.addEventListener('click', (e) => {
    modal.setAttribute('is-open', 'false');

    inputField.value = document.querySelector('.textarea').innerHTML; 
});



picBtn.addEventListener('click', (e) => {

    if (modal.getAttribute('is-open') === 'false') {
        modal.setAttribute('is-open', 'true');
        setFocus('.textarea');
    }

    if (document.querySelector('.preview').getAttribute('data-hidden') == 'true') {
        document.querySelector('.preview').setAttribute('data-hidden', 'false');
        
        document.querySelector('.x-wrapper').style.borderRadius = '20px';
        document.querySelector('.x-wrapper').style.backgroundColor = '#f0f2f5';

    } else if (document.querySelector('.preview').getAttribute('data-hidden') == 'false') {
        document.querySelector('.preview').setAttribute('data-hidden', 'true');

        document.querySelector('.x-wrapper').style.borderRadius = '';
        document.querySelector('.x-wrapper').style.backgroundColor = '';
    }
});


picBtnX.addEventListener('click', (e) => {

    if (modal.getAttribute('is-open') === 'false') {
        modal.setAttribute('is-open', 'true');
        setFocus('.textarea');
    }

    if (document.querySelector('.preview').getAttribute('data-hidden') == 'true') {
        document.querySelector('.preview').setAttribute('data-hidden', 'false');
        
        document.querySelector('.x-wrapper').style.borderRadius = '20px';
        document.querySelector('.x-wrapper').style.backgroundColor = '#f0f2f5';

    } else if (document.querySelector('.preview').getAttribute('data-hidden') == 'false') {
        document.querySelector('.preview').setAttribute('data-hidden', 'true');

        document.querySelector('.x-wrapper').style.borderRadius = '';
        document.querySelector('.x-wrapper').style.backgroundColor = '';
    }
});

closePrev.addEventListener('click', function () {
    
    if (imgInput.value !== '' || imgInput.value !== null) {
        imgInput.value = null;
    } 
    if (document.getElementById('dynamic-image')) {
        document.querySelector('#dynamic-image').remove();
        doRequest('DELETE', 'uploadpreview');
    }
});
