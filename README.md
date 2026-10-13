# OTT-PLATFORM (MovieNest)

A movie and web-series streaming website built with the MERN stack, with a **User portal** and an **Admin portal**.

| Folder | What it is |
|---|---|
| `client/` | Frontend: React.js + Vite + Bootstrap + React Router + Axios |
| `server/` | Backend: Node.js + Express.js + JWT login |
| `database/` | MongoDB tools: admin account, export and import of data |

## Features
- **User:** register, log in, browse movies and series, search, filter by genre, watch while online, Watch later list.
- **Admin:** dashboard (registered users, users active in the last 24 hours, total plays, most watched), remove users, add / edit / delete movies and series with episodes.
- **Site pages:** About us, Contact us, Help and FAQ, Report a problem, Privacy policy, Terms of use, and a footer with links.
- Contact messages and problem reports are saved in MongoDB. The admin reads them in the **Inbox**, replies by email, marks them resolved or deletes them.
- Login uses JWT. Admin pages are protected, normal users cannot open them.
- Edit `client/src/siteInfo.js` to change the contact email, address and tagline shown on the site.

## What you need first
1. **Node.js** (LTS) from https://nodejs.org
2. **MongoDB Community Server** from https://www.mongodb.com/try/download/community (tick "Install as a Service" and "MongoDB Compass")
3. **Git**, only if you download the project from GitHub

## Run it on Windows (easy way)
1. Download or clone this project. `git clone https://github.com/YOUR-USERNAME/OTT-PLATFORM.git`
2. Double-click **setup.bat** once. Wait for "SETUP DONE".
3. Double-click **start.bat**. Two black windows open (keep them open) and the website opens at http://localhost:5173

## Run it on any computer (Windows, Mac, Linux)
```
npm install
npm run seed
npm run dev
```
Then open http://localhost:5173

- `npm install` installs the packages for the root, server, client and database folders.
- `npm run seed` loads saved movies (if `database/data` exists) and creates the admin account.
- `npm run dev` starts the backend (port 8000) and the frontend (port 5173) together.

## Admin login
Email: `admin@ott.com`  Password: `admin123`

New users can register themselves from the website.

## Movies and posters
- Movie files go in `server/videos/` and poster images in `server/posters/`.
- In the admin panel write the links like `/videos/movie1.mp4` and `/posters/movie1.jpg`.
- You can also paste a YouTube link or any direct `.mp4` link.
- Movie files are not stored on GitHub because they are too big. Share them with Google Drive or a pendrive and put them in `server/videos/` with the same file names.

## Share your running website with others on the same Wi-Fi
Run the project on your computer. The backend window prints a line like
`Other computers on the same Wi-Fi can open: http://192.168.1.5:5173`
Other devices on the same Wi-Fi can open that address. Allow Node.js in the Windows firewall if it asks. Your computer must stay on.

## Move your data to another computer
1. On your computer (MongoDB running): double-click **pack.bat**, or run `npm run export`. This saves your movies and users into `database/data`.
2. Copy the project, including `server/videos`, to the other computer.
3. There, run **setup.bat** (or `npm install` then `npm run seed`).

## API list
| Method | URL | Who | What it does |
|---|---|---|---|
| POST | /api/auth/register | anyone | create user |
| POST | /api/auth/login | anyone | login, returns JWT token |
| GET | /api/content | user | list movies/series (?type=movie&search=) |
| GET | /api/content/:id | user | one title (+1 view) |
| GET | /api/watchlist | user | my watch later list |
| POST | /api/watchlist/:id | user | add to watch later |
| DELETE | /api/watchlist/:id | user | remove from watch later |
| POST | /api/support/contact | anyone | send a contact message |
| POST | /api/support/report | user | report a problem |
| GET | /api/admin/stats | admin | dashboard numbers |
| GET | /api/admin/users | admin | all users |
| DELETE | /api/admin/users/:id | admin | remove user |
| GET | /api/admin/content/:id | admin | one title for editing |
| POST | /api/admin/content | admin | add title |
| PUT | /api/admin/content/:id | admin | edit title |
| DELETE | /api/admin/content/:id | admin | delete title |
| GET | /api/admin/messages | admin | contact messages and reports (?kind=&status=) |
| PATCH | /api/admin/messages/:id | admin | mark open or resolved |
| DELETE | /api/admin/messages/:id | admin | delete a message |

## MongoDB collections (database: ott_platform)
- **users:** name, email, password (hashed), role ("user" or "admin"), watchlist [content ids], createdAt, lastLogin
- **messages:** kind ("contact" or "report"), name, email, subject or reportType, message, contentId, contentTitle, status ("open" or "resolved"), createdAt
- **content:** title, description, type ("movie" or "series"), genre, releaseYear, poster, videoUrl, episodes [{number, title, videoUrl}], views, createdAt

## Problems
- `Connection failed. Is MongoDB running?` -> open Windows Services and start **MongoDB Server**.
- `npm is not recognized` -> install Node.js, then restart the computer.
- Website opens but there are no movies -> log in as admin and add titles, or run `npm run seed` after placing `database/data/content.json`.
- Video does not play -> check the file is inside `server/videos` and the name in the admin panel matches.
