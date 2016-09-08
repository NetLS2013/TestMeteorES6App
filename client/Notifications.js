BrowserNotification = function(title, text) {
    if (!Notification) {
        console.log('Desktop notifications not available in your browser. Try Chromium.');
        return;
    }
    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification(title, {
            //icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
            body: text,
        });
        notification.onclick = function () {
            //window.open(location.host);
        };
    }
};