# Hytee

Hytee is a lightweight, 0 dependency HTTP client built on the native Fetch API.

## Features

- Simple GET, POST, PUT, DELETE requests
- Default configuration for every request
- Easy switching between temporary and default settings
- Case converting
- JWT token appending

## Installation

```
npm i hytee
```

## Usage

> This is a simple JavaScript example. The initialization might be run differently in a framework, but the sending of requests is pretty much the same.

```javascript
import Hytee from 'hytee';

// Create a function that will send the request
const login = () => {
	Hytee.put('/login', { email: 'email', password: 'password' })
		.then(res => {
			// successful request
		})
		.catch(err => {
			// unsuccessful request
		});
};

// Create a function that initializes the Hytee package
// This needs to be run only once per page load
const init = () => {
	Hytee.initialize({
		url: 'https://localhost:44300/api',
		parseResult: true,
		stringify: true,
		caseConvert: 'pascalToCamel',
		contentType: 'application/json',
	});

	// Send the request when the button is clicked
	const button = document.getElementById('login');
	button.onclick = login;
};

// Run the initializer function on page load
window.onload = init;
```
