document.addEventListener("DOMContentLoaded", async () => {
  if (!("serviceWorker" in navigator)) return;

  const sw = await navigator.serviceWorker
    .register("./sw.js", { scope: "/" })
    .catch((e) =>
      console.log(`Could not register service worker due to ${e.message}`)
    );
  if (sw) console.log("Service worker registered successfully");
});

const subscribe = async () => {
  const sw = await navigator.serviceWorker.ready;
  const emailInput = document.getElementById("email");

  if (!("Notification" in window)) {
    console.error("Your browser doesnt support notifications");
  }

  const requestPermissionResponse =
    await Notification.requestPermission().catch((e) =>
      console.error(
        `An error occurred while requesting permissions: ${e.message}`
      )
    );

  if (requestPermissionResponse !== "granted") {
    console.error("Permission NOT granted");
  }

  const rawPushResponse = await sw.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey:
        "BFaZEjyA3l7oY7KAOVH5k8bVQb5eVKo5D1u4pcrU4A1Iv0daAdFLwm-cX0q7is92KONFS8c3fLuYfSm4ydgma5c",
    })
    .catch((e) =>
      console.error(
        `An error occurred while subscribing to push notifications: ${e.message}`
      )
    );

  const push = JSON.parse(JSON.stringify(rawPushResponse));

  const fetchResponse = await fetch("http://localhost:5000/subscribe", {
    body: JSON.stringify({
      email: emailInput?.value,
      ...push,
    }),
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
  }).catch((e) =>
    console.error(`Could not complete request due to ${e.message}`)
  );

  console.log("PUSH RESPONSE", push);
};
