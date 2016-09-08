import '../imports/ui/router.js';

import '../imports/startup/accounts-config.js';
import '../imports/ui/mainLayout/App_body.js';

document.addEventListener('DOMContentLoaded', function () {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
});
