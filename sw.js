self.addEventListener("install", () => {
  self.skipWaiting();
  console.log("Installed successfully");
});

self.addEventListener("activate", async (ev) => {
  ev.waitUntil(
    clients.claim().then(() => console.log("Client claimed successfully"))
  );
  console.log("Client activated successfully");
});

self.addEventListener("push", (ev) => {
  console.log("EVENT", ev);
  console.log("EVENT DATA", ev?.data?.json());

  const data = ev?.data?.json();

  ev.waitUntil(
    self.registration.showNotification(data?.title || "From SW practice", {
      body: data?.message || "Hello! I'm Prince",
      icon: "./web-notifications-app-icon.png",
      badge: "./web-notifications-app-icon.png",
      data: { destinationURL: data?.destinationURL || "/" },
    })
  );
});

self.addEventListener("notificationclick", (ev) => {
  ev.notification.close();

  console.log("NOTIFICATION CLICKED!", ev);
  clients.openWindow(ev?.notification?.data?.destinationURL || "/", "_blank");
});
