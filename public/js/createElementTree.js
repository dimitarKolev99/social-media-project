const cardElProps = function(user, content, imageUrl) {
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

export { cardElProps, create, topLevel, tree, traverse };