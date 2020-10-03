let is_edit = false;

function date_now() {
    return new Date()
}

function get_id(i){
    let rnd = '';
    while (rnd.length < i)
        rnd += Math.random().toString(36).substring(2);
    return rnd.substring(0, i);
}

function getAllData(){
    return {
        "id" : get_id(7),
        "title" : document.getElementById('title').value,
        "content":  document.getElementById('text').value,
        "date": date_now()
    };
}

function pushToLocalStorage(data) {
    data = getAllData()
    if (data['title'] !== '' && data['content'] !== '') {
        if(is_edit) {
            let uuid = document.getElementById('title').attributes['edit-uuid'];
            updateLocalStorageItem(uuid, 'title', document.getElementById('title').value)
            updateLocalStorageItem(uuid, 'content', document.getElementById('text').value)
            updateLocalStorageItem(uuid, 'date', date_now())
        } else {
            localStorage.setItem(data.id, JSON.stringify(data));
        }
        renderItemsFromLocalStorage();

    }
    else {
        alert('Введите заголовок и содержание заметки')
    }
    document.getElementById('title').value = "";
    document.getElementById('text').value = "";
    is_edit = false;

}

function renderItemsFromLocalStorage() {
    let parent = document.getElementById('list');
    parent.innerHTML = ''

    let temp = [];
    for(let key in localStorage) {
        if(JSON.parse(localStorage.getItem(key)))
        temp.push(JSON.parse(localStorage.getItem(key)));
    }
    let sorted = temp.sort(function(a, b){
        if(a && b && b.hasOwnProperty('date') && a.hasOwnProperty('date'))
        return new Date(b.date) - new Date(a.date);

        return 0;
    });

    for(let item of sorted) {
        let wrapNode = document.createElement('div');
        let titleNode = document.createElement('h2');
        let dateNode = document.createElement('h3');
        let contentNode = document.createElement('h4');
        let editButtonNode = document.createElement('button', );
        let deleteButtonNode = document.createElement('button');

        titleNode.innerText = item.title;
        contentNode.innerText = item.content.slice(0,23).split('\n')[0];
        dateNode.innerText = new Intl.DateTimeFormat('ru', {
            year: "numeric",
            month: "long",
            day: "numeric"
        }).format(new Date());
        editButtonNode.innerText = "Редактировать";
        deleteButtonNode.innerText = "Удалить";

        wrapNode.setAttribute('class', 'box')
        wrapNode.id = 'div'

        contentNode.id = 'content'
        dateNode.id = 'date'


        editButtonNode.id = 'edit'
        editButtonNode.setAttribute('data-ed-uuid', item.id)
        wrapNode.setAttribute('data-ed-uuid', item.id)

        deleteButtonNode.id = 'delete'
        deleteButtonNode.setAttribute('data-del-uuid', item.id)

        wrapNode.appendChild(titleNode);
        wrapNode.appendChild(dateNode);
        wrapNode.appendChild(contentNode);
        wrapNode.appendChild(editButtonNode);
        wrapNode.appendChild(deleteButtonNode);

        parent.append(wrapNode);
        document.getElementById('dateOfEditing').innerHTML = ' ';
    }
}

document.addEventListener('DOMContentLoaded', function(){
    renderItemsFromLocalStorage();
});

document.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-ed-uuid')) {
        const uuid = e.target.attributes['data-ed-uuid'].nodeValue;
        is_edit = true;
        fillEditableZone(uuid);}
    else if (e.target.hasAttribute('data-del-uuid')){
        const uuid = e.target.attributes['data-del-uuid'].nodeValue;
        deleteNote(uuid);
        }
})

function fillEditableZone(uuid) {
    let data = JSON.parse(localStorage.getItem(uuid));
    if (data) {
        document.getElementById('title').value = data.title;
        document.getElementById('title').attributes['edit-uuid'] = uuid;
        document.getElementById('text').value = data.content;
    } else {
        console.error('Отсутствуют данные ' + uuid)
    }
    document.getElementById('dateOfEditing').innerHTML = new Intl.DateTimeFormat('ru', {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    }).format(new Date(data.date))
    window.location.hash = data.id;
}

function deleteNote(id){
        localStorage.removeItem(id)
    renderItemsFromLocalStorage();
}

function createNewNote(){
    document.getElementById('title').value = '';
    document.getElementById('text').value = '';
    document.getElementById('dateOfEditing').innerHTML = ' ';
    window.location.hash = 'New_Note'
}

function updateLocalStorageItem(uuid, key, value) {
    let existing = localStorage.getItem(uuid);
    existing = existing ? JSON.parse(existing) : {};
    existing[key] = value;
    localStorage.setItem(uuid, JSON.stringify(existing));
}