async function loadSubscriptions() {
    const response = await fetch('/subscriptions');
    const subscriptions = await response.json();
    const list = document.getElementById('subscriptions-list');
    list.innerHTML = '';

    subscriptions.forEach(sub => {
        const item = document.createElement('div');
        item.textContent = `${sub.name} - ${sub.subscription_date} to ${sub.end_date} - ${sub.phone} - ${sub.subscription_type}`;
        list.appendChild(item);
    });
}

function showForm(type) {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = '';

    if (type === 'add') {
        formContainer.innerHTML = `
            <form onsubmit="addSubscription(event)">
                <input type="text" id="name" placeholder="الاسم" required>
                <input type="date" id="subscription-date" required>
                <input type="date" id="end-date" required>
                <input type="text" id="phone" placeholder="رقم الهاتف" required>
                <input type="text" id="subscription-type" placeholder="نوع الاشتراك" required>
                <button type="submit">إضافة اشتراك</button>
            </form>`;
    } else if (type === 'delete') {
        formContainer.innerHTML = `
            <form onsubmit="deleteSubscription(event)">
                <input type="text" id="delete-id" placeholder="أدخل معرف الاشتراك" required>
                <button type="submit">حذف اشتراك</button>
            </form>`;
    } else if (type === 'search') {
        formContainer.innerHTML = `
            <form onsubmit="searchSubscription(event)">
                <input type="text" id="search-query" placeholder="أدخل الاسم" required>
                <button type="submit">بحث</button>
            </form>`;
    } else if (type === 'renew') {
        formContainer.innerHTML = `
            <form onsubmit="renewSubscription(event)">
                <input type="text" id="renew-id" placeholder="أدخل معرف الاشتراك" required>
                <input type="date" id="new-end-date" required>
                <button type="submit">تجديد الاشتراك</button>
            </form>`;
    }
}

async function addSubscription(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const subscription_date = document.getElementById('subscription-date').value;
    const end_date = document.getElementById('end-date').value;
    const phone = document.getElementById('phone').value;
    const subscription_type = document.getElementById('subscription-type').value;

    const response = await fetch('/add_subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subscription_date, end_date, phone, subscription_type })
    });

    const result = await response.json();
    alert(result.message);
    loadSubscriptions();
}

async function deleteSubscription(event) {
    event.preventDefault();
    const id = parseInt(document.getElementById('delete-id').value);

    const response = await fetch('/delete_subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });

    const result = await response.json();
    alert(result.message);
    loadSubscriptions();
}

async function searchSubscription(event) {
    event.preventDefault();
    const query = document.getElementById('search-query').value;

    const response = await fetch('/search_subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });

    const results = await response.json();
    const list = document.getElementById('subscriptions-list');
    list.innerHTML = results.map(sub => `${sub.name} - ${sub.subscription_date} to ${sub.end_date}`).join('<br>');
}

async function renewSubscription(event) {
    event.preventDefault();
    const id = parseInt(document.getElementById('renew-id').value);
    const new_end_date = document.getElementById('new-end-date').value;

    const response = await fetch('/renew_subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, new_end_date })
    });

    const result = await response.json();
    alert(result.message);
    loadSubscriptions();
}
