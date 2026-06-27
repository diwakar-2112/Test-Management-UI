# Google Sign-In Integration Guide (Frontend)

## Overview
Use Google Identity Services (GIS) on the frontend to get a Google ID token, then send that token to your backend for verification and app login/session creation.

## 1. Add Google SDK
Include this in your HTML (usually `index.html`):

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

## 2. Add Button Container
Place a target element where Google should render the button:

```html
<div id="google-btn"></div>
```

## 3. Initialize and Render
After the page/component is ready and SDK is loaded:

```ts
declare const google: any;

const clientId = "YOUR_GOOGLE_CLIENT_ID";

google.accounts.id.initialize({
  client_id: clientId,
  callback: handleGoogleLogin
});

google.accounts.id.renderButton(
  document.getElementById("google-btn"),
  { theme: "outline", size: "large", width: "100%" }
);
```

## 4. Handle Google Response
Google returns an ID token in `response.credential`.

```ts
async function handleGoogleLogin(response: any) {
  const idToken = response.credential;

  await fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken })
  });
}
```

## 5. Backend Responsibility
Backend should:
1. Verify the Google ID token with Google libraries.
2. Validate issuer, audience (client ID), expiry, and email.
3. Create app user/session/JWT based on verified identity.
4. Return your app auth response to frontend.

## 6. Common Errors
1. `google.accounts.id.initialize is not a function`
Cause: SDK not loaded yet, or method name typo (`intialize`).

2. `google is undefined`
Cause: script missing or code runs before SDK load.

3. Button not visible
Cause: wrong container ID, hidden element, or render called too early.

## 7. Security Notes
1. Do not trust Google token only on frontend.
2. Always verify token on backend before login.
3. Keep client ID in config/env and use correct one per environment.
