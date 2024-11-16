const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// مسار ملف الاشتراكات
const subscriptionsFilePath = path.join(__dirname, 'subscriptions.json');

// تحميل بيانات الاشتراكات
function loadSubscriptions() {
    if (fs.existsSync(subscriptionsFilePath)) {
        const data = fs.readFileSync(subscriptionsFilePath, 'utf8');
        return JSON.parse(data);
    }
    return { subscriptions: [] };
}

// حفظ بيانات الاشتراكات
function saveSubscriptions(data) {
    fs.writeFileSync(subscriptionsFilePath, JSON.stringify(data, null, 4), 'utf8');
}

// إعدادات Express
app.use(express.static('.'));
app.use(express.json());

// عرض جميع الاشتراكات
app.get('/subscriptions', (req, res) => {
    const data = loadSubscriptions();
    res.json(data.subscriptions);
});

// إضافة اشتراك جديد
app.post('/add_subscription', (req, res) => {
    const { name, subscription_date, end_date, phone, subscription_type } = req.body;
    const data = loadSubscriptions();

    const newSubscription = {
        id: Date.now(),
        name,
        subscription_date,
        end_date,
        phone,
        subscription_type
    };

    data.subscriptions.push(newSubscription);
    saveSubscriptions(data);

    res.json({ message: "تم إضافة الاشتراك بنجاح!" });
});

// حذف اشتراك
app.post('/delete_subscription', (req, res) => {
    const { id } = req.body;
    const data = loadSubscriptions();

    const updatedSubscriptions = data.subscriptions.filter(sub => sub.id !== id);
    saveSubscriptions({ subscriptions: updatedSubscriptions });

    res.json({ message: "تم حذف الاشتراك بنجاح!" });
});

// البحث عن اشتراك
app.post('/search_subscription', (req, res) => {
    const { query } = req.body;
    const data = loadSubscriptions();

    const results = data.subscriptions.filter(sub => sub.name.includes(query));
    res.json(results);
});

// تجديد الاشتراك
app.post('/renew_subscription', (req, res) => {
    const { id, new_end_date } = req.body;
    const data = loadSubscriptions();

    const subscription = data.subscriptions.find(sub => sub.id === id);
    if (subscription) {
        subscription.end_date = new_end_date;
        saveSubscriptions(data);
        res.json({ message: "تم تجديد الاشتراك بنجاح!" });
    } else {
        res.status(404).json({ message: "الاشتراك غير موجود!" });
    }
});

// بدء الخادم
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
