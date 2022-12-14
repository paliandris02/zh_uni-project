const form = document.getElementById('form');
const search = document.getElementById('search');
const submitButton = document.getElementById('submit');
const inputArea = document.getElementById('inputData');
const addOrEditTitle = document.querySelector('.addTitle');
const idInput = document.getElementById('idInput');
const temp = document.getElementById('temp');
const orders = document.getElementById('orders');
let deleteButtons;
let editButtons;

const state = {
    method: 'POST',
    currentOrderIdToEdit: '',
};

orders.innerHTML = `<p class="messages NeutralOrBadResponse">Adatok betöltése...</p>`;
orders.style.height = `${window.innerHeight}px`;
inputArea.style.height = `${window.innerHeight}px`;


const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'cc9106ea90mshb29b84cf4bee4a2p17e40fjsna0e04c11167b',
        'X-RapidAPI-Host': 'weatherbit-v1-mashape.p.rapidapi.com',
    },
};
const weatherDisplay = async function () {
    const res = await fetch(
        'https://weatherbit-v1-mashape.p.rapidapi.com/current?lon=19.040236&lat=47.497913&units=metric&lang=hu',
        options
    );
    const data = await res.json();
    if (!res.ok) {
        temp.innerHTML = `Weather API: az ingyenes napi 25 requestet elhasználtad!`;
        return;
    }
    temp.innerHTML = `${data.data[0].app_temp}°C <br> ${data.data[0].weather.description} <br> Napkelte: ${data.data[0].sunrise} <br> Napnyugta: ${data.data[0].sunset}`;
};

const loadOrders = async function () {
    const res = await fetch(`orders/`);
    const data = await res.json();
    if (!res.ok) {
        orders.innerHTML = `${res.status}:${res.statusText}`;
        return;
    }
    render(data);
}

const loadOrdersById = async function (id) {
    if (!id) {
        loadOrders();
        return;
    }
    if (isNaN(id)) {
        orders.innerHTML = `<p class="messages NeutralOrBadResponse">Érvénytelen ID(${id}).</p>`;
        return;
    }
    const res = await fetch(`orders/${id}`);
    const data = await res.json();
    if (!data) {
        orders.innerHTML = `<p class="messages NeutralOrBadResponse">Rendelés nem található (${id}) ID-vel.</p>`;
        return;
    }
    render([data]);
}

const render = function (data) {
    let markup = CreateMarkup(data);
    orders.innerHTML = "";
    orders.insertAdjacentHTML('afterbegin', markup);
    deleteButtons = document.querySelectorAll(".deleteButton");
    editButtons = document.querySelectorAll(".editButton");
    addEventListenersEditDelete(editButtons, deleteButtons);
    return;
}

const addEventListenersEditDelete = function (editButtons, deleteButtons) {
    for (let button of deleteButtons) {
        button.onclick = function (event) {
            orders.innerHTML = `<p class="messages NeutralOrBadResponse">Rendelés törlése...</p>`;
            deleteOrder(event.target.parentElement.id);
        };
    }

    for (let button of editButtons) {
        button.onclick = function (event) {
            state.method = 'PUT';
            state.currentOrderIdToEdit = button.parentElement.id;
            addOrEditTitle.innerHTML = `Rendelés szerkesztése`;
            addOrEditTitle.classList.add('editTitle');
            form.style.borderColor = 'darkred';
            idInput.value = button.parentElement.id;
        };
    }
    return;
};

const deleteOrder = async function (id) {
    const req = await fetch(`orders/${id}`, { method: 'DELETE' });
    if (req.status === 200) {
        orders.innerHTML = `<p class="messages goodResponse">Rendelés törölve!</p>`;
        search.value = '';
        setTimeout(loadOrders, 3000);
        return;
    }
    orders.innerHTML = `<p class="messages NeutralOrBadResponse">Rendelés törlése nem sikerült :( ${req.status}:${req.statusText}</p>`;
    return;
};

const submitOrder = async function (event, method = 'POST', id = '') {
    event.preventDefault();

    const regex = new RegExp("\\b([1-9]|[1-9][0-9]|100)\\b", 'g');
    if (!regex.test(event.target.idInput.value)) {
        orders.innerHTML = `<p class="messages NeutralOrBadResponse">Rendelés ID csak szám lehet 1 és 100 között!</p>`;
        setTimeout(loadOrders, 2000);
        return;
    }

    const avatarReq = await fetch(
        `https://robohash.org/${event.target.fullName.value}.png?size=100x100&set=set5`
    );
    let order = {
        orderId: event.target.idInput.value,
        fullName: event.target.fullName.value,
        avatar: avatarReq.url,
        email: event.target.email.value,
        country: event.target.country.value,
        address: event.target.address.value,
        date: event.target.date.value,
        creditcard: event.target.creditcard.value,
        amount: event.target.amount.value,
    };
    try {
        const PostRes = await fetch(`orders/${id}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });
        console.log(PostRes);
        if (PostRes.status === 200) {
            orders.innerHTML = `<p class="messages goodResponse">Rendelés ${state.method === 'POST' ? 'felvétele' : 'szerkesztése'
                } sikeres!</p>`;
            event.target.idInput.value = '';
            event.target.fullName.value = '';
            event.target.email.value = '';
            event.target.country.value = '';
            event.target.address.value = '';
            event.target.date.value = '';
            event.target.creditcard.value = '';
            event.target.amount.value = '';
        }
    } catch (error) {
        orders.innerHTML = `<p class="messages NeutralOrBadResponse">Rendelés felvétele nem sikerült :( ${error}</p>`;
        setTimeout(loadOrders, 3000);

        return;
    }
    SetDefaultValues();
    setTimeout(loadOrders, 4000);
    return;
};

const CreateMarkup = function (data) {
    let markup = '';
    for (let order of data) {
        markup += `<div class="order" id="${order.orderId}">
                  <div>${order.orderId}</div>
                  <img src="${order.avatar}" class="avatar" />
                  <div class="fullName">${order.fullName}</div>
                  <div class="email">${order.email}</div>
                  <div class="country">${order.country}</div>
                  <div class="address">${order.address}</div>
                  <div class="date">${order.date}</div>
                  <div class="creditcart">${order.creditcard}</div>
                  <div class="amount">${order.amount}</div>
                  <div class="editButton">Szerkesztés</div>
                  <div class="deleteButton">Törlés</div>
                </div>`;
    }
    return markup;
}

const SetDefaultValues = function () {
    state.method = 'POST';
    state.currentOrderIdToEdit = '';
    addOrEditTitle.innerHTML = 'Rendelés hozzáadása';
    addOrEditTitle.classList.remove('editTitle');
    form.style.borderColor = 'forestgreen';
    idInput.value = '';
    search.value = '';
};

window.onload = loadOrders();
window.onload = weatherDisplay();
search.onkeyup = function () {
    loadOrdersById(search.value);
}
form.onsubmit = function (event) {
    submitOrder(event, state.method, state.currentOrderIdToEdit);
};
