// Where the backend lives.
// By default it is the same computer that served this page, on port 8000.
// So it works on localhost AND when another computer opens http://<your-ip>:5173
// To point at an online backend later, set VITE_API_URL (example: https://my-api.onrender.com)
export const SERVER_URL =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:8000`;
