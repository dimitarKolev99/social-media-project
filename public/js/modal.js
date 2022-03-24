const inputField = document.querySelector('#content');
const modal = document.querySelector('.post-modal');
const picBtn = document.querySelector('.x-wrapper');
inputField.addEventListener('click', (e) => {
    e.preventDefault();
    
    modal.setAttribute('is-open', 'true');
});

const closeBtn = document.querySelector('#close');
closeBtn.addEventListener('click', (e) => {
    modal.setAttribute('is-open', 'false');
});

picBtn.addEventListener('click', (e) => {
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