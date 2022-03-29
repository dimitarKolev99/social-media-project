document.querySelector('#inp--button').addEventListener('click', function (e) {
    console.log('HERE');
    if (document.querySelector('#inp--file').value === '' ||
    document.querySelector('#inp--file').value === null) {
        e.preventDefault();
        alert('Please select an image');
    }
  }); 
