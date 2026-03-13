# JWT Encoder and Decoder

This project is a web-based tool for encoding and decoding JSON Web Tokens (JWT). It provides a simple interface for developers to inspect JWT structure, generate tokens, and understand how JWT signatures work.

The application is built using Next.js, React, and TypeScript, with a maroon-themed interface designed for clarity and usability.

---

## Overview

JSON Web Tokens are commonly used for authentication and authorization in modern web applications. A JWT consists of three parts separated by dots:

HEADER.PAYLOAD.SIGNATURE

* **Header** contains metadata such as the signing algorithm.
* **Payload** contains the claims or data carried by the token.
* **Signature** is used to verify that the token has not been modified.

This tool allows users to visualize and generate JWT tokens in a structured and interactive way.

---

## Features

### Decoder

The decoder page allows users to inspect an existing JWT token.

Capabilities include:

* Paste a JWT token and decode it instantly
* View the decoded header and payload in formatted JSON
* Display the signature section of the token
* Color-coded visualization of the three JWT segments
* Copy decoded sections to the clipboard
* Clear token input
* Load an example token for testing

### Encoder

The encoder page allows users to generate new JWT tokens.

Capabilities include:

* Define custom header JSON
* Define payload JSON
* Provide a secret key
* Select signing algorithm
* Generate a signed JWT token
* Copy the generated token

---

## User Interface

The interface uses a maroon-based color theme designed for readability.

Color scheme:

Background: `#1b0b0b`
Cards: `#2a0f0f`
Buttons: `#9b1c31`

The encoded JWT token is visually segmented for easier understanding:

Header segment: bright yellow
Payload segment: bright cyan
Signature segment: bright orange/red

Each segment is displayed separately to help illustrate how JWT tokens are structured.

---

## Error Handling

The application validates token input and handles the following cases:

* Invalid JWT format (token must contain three segments)
* Base64 decoding errors
* Invalid JSON in header or payload
* Signature validation constraints

Clear error messages are displayed to guide the user.

---

## Technology Stack

* Next.js
* React
* TypeScript
* TailwindCSS
* JOSE library for JWT signing

---

## Running the Project

Clone the repository:

```
git clone https://github.com/yourusername/jwt-tool.git
```

Install dependencies:

```
npm install
```

Run the development server:

```
npm run dev

```

Open the application in a browser at:

```
http://localhost:3000
```

---

## Security Notice

This tool is intended for educational and debugging purposes. Secret keys used to sign JWT tokens should never be exposed in client-side applications in production environments.
