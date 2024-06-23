## NOTEK: A Web App for Note Taking 📝

## BUILD WITH: MEEN ==> MongoDB: 🍃, Express: 🚂, EJS: 📄, Node.js: 🟢

| Technology | Description | Logo |
|------------|-------------|-------|
| **MongoDB** | NoSQL database for storing data. | <img src="https://w7.pngwing.com/pngs/489/225/png-transparent-mongodb-logo-black-tech-companies-thumbnail.png" alt="MongoDB" width="150px"/> |
| **Express** | Web application framework for Node.js. | <img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" alt="Express" width="150px"/> |
| **EJS** | Simple templating language that lets you generate HTML markup with plain JavaScript. | <img src="https://miro.medium.com/v2/resize:fit:1278/1*i-YOI4nMBnyPfjSulLxDLA.png" alt="EJS" width="150px"/> |
| **Node.js** | JavaScript runtime built on Chrome's V8 JavaScript engine. | <img src="https://blog.4linux.com.br/wp-content/uploads/2019/12/node-js-1900x950_c.png" alt="Node.js" width="150px"/> |


## Features

| Category            | Feature                                | Icon |
|---------------------|----------------------------------------|------|
| **CRUD Operations** | Create                                 | ✨    |
|                     | Read                                   | 📖    |
|                     | Update                                 | 🔄    |
|                     | Delete                                 | 🗑️    |
| **Styling**         | Tailwind CSS                           | 🎨    |
|                     | Responsive Design                      | 📱    |
| **Authentication**  | Login                                  | 🔑    |
|                     | Signup                                 | ✍️    |
|                     | Single Sign On (SSO)                   |  🔑   |
|                     | Email Verification                     | 📧    |
|                     | Many Checks During Signup and login    | ✅    |
| **Security**        | Protect Website from Disposable Email  | 🚫✉️  |
|                     | Protect from (CSRF) Attack             | 🛡️    |
|                     | Rate Limiting                          | ⏳    |
|                     | New Login Verification                 | 🌐    |
|                     | Notes and password are Encrypted in Database | 🍃  |
| **Account Recovery**| Reset Password                         |      |
|                     | Change Email                           |      |


## SOME  PREVIEWS 👁️

### HomeLogOut 🚪
<img src="./public/images/preview1.png" alt="HomelogOut" width="1080px" height="450">

### Home Login Blank 🔲
<img src="./public/images/preview2.png" alt="HomelogOut" width="1080px" height="450">

### Home Login 🔑 With Note 📝
<img src="./public/images/preview3.png" alt="HomelogOut" width="1080px" height="450">

<br/>

# Running the Project Locally
### To run this project on your local system, setup few things before cloning the repo!:

#### First, go to the <a href="https://myaccount.google.com/security">Gmail Account Security Settings</a> In the search bar, type `"app password"` and follow the instructions to create an app password for your Gmail account then copy password and save it, This will be used for `email verification.`

# App Password look Like:
<img src="./public/images/appPass.png" alt="appPass" width="500px">

#### Note: 2-Step verification must be enabled on your Gmail account; otherwise, you will not be able to create an app password.

<br/>

## Database Connection

### To set up the database connection, follow these steps:

#### 1. Go to <a href="https://cloud.mongodb.com/"> MongoDB Cloud.</a> If you do not have an account, create one.

#### 2. Create a database cluster, For tutorial simply search or <a href="https://www.youtube.com/results?search_query=how+to+create+a+cluster+on+MongodB">Click Here</a>

#### 3. Copy the MONGODB_URI and save it. This will be used to store our user information.

<br/>

## Single Sign On (SSO) Setup:

- #### `Google:` To get `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` got to <a href="https://console.cloud.google.com/apis/credentials">Google Cloud</a> and create OAuth Credentials, For tutorial simply search or <a href="https://www.youtube.com/results?search_query=how+to+create+google+oauth+credentials+(client+id+and+secret)+">Click Here</a>

- #### `Github:` To get `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` got to <a href="https://github.com/settings/developers">GIthub Developer Settings</a> and create OAuth Credentials, For tutorial simply search or <a href="https://www.youtube.com/results?search_query=how+to+create+github+oauth+credentials+(client+id+and+secret)+">Click Here</a>

- #### `Microsoft:` To get `MICROSOFT_CLIENT_ID` and `MICROSOFT_CLIENT_SECRET` got to <a href="https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade">Azure App Registrations</a> and create OAuth Credentials, For tutorial simply search or <a href="https://www.youtube.com/results?search_query=how+to+create+mcirosoft+oauth+credentials+(client+id+and+secret)+">Click Here</a>

- #### `Discord:` To get `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` got to <a href="https://discord.com/developers/applications">Discord Developer</a> and create OAuth Credentials, For tutorial simply search or <a href="https://www.youtube.com/results?search_query=how+to+create+discord+oauth+credentials+(client+id+and+secret)+">Click Here</a>

<br/>


## Installation 🛠️

1. Clone this repository to your local machine.

```bash
git clone https://github.com/Emmraan/notek.git
```

2. Navigate to the project directory.

```bash
cd  notek
```
3. Install dependencies using npm:

```bash
npm install
```
<br/>

## Setting Up Environment Variables

1. #### Follow these steps to set up your environment variables:

2. #### Create a new .env file in the root directory of this project.

3. #### Copy the variables from .env.example and paste them into the new .env file.

4. #### Replace the placeholder values with your own.

#### In the .env file, use the following format:


```Environment Variables

## Replace the username password and Database name.

1. MONGO_URI="mongodb+srv://<username>:<password>@cluster0.4m7l6.mongodb.net/<yourDBname>?retryWrites=true&w=majority&appName=Cluster0"

## Generate or create a long hex secret for JWT_SECRET, SESSION_SECRET and NOTE_SECRET e.g., 7f45d1f47ebf4e1af1e148cd00fe97e5472df8e5b5c8e8af

2. JWT_SECRET=your_jwt_seceret_here

3. PORT=3000

4. USER= <here your email>

5. PASS= <here your app password>

## This domain is attached before email_verify route!
## For development purposes, use: http://localhost:3000

6. DOMAIN= <here your domain>

## session secrect same like jwt secrect

7. SESSION_SECRET=your_session_seceret_here

## NOTE secrect same like jwt and session secrect but make sure the length of NOTE_SECRET is 32 .

8. NOTE_SECRET=your_session_seceret_here

9.GOOGLE_CLIENT_ID=<here your GOOGLE_CLIENT_ID>
10.GOOGLE_CLIENT_SECRET=<here your GOOGLE_CLIENT_SECRET>

11.GITHUB_CLIENT_ID=<here your GITHUB_CLIENT_ID>
12.GITHUB_CLIENT_SECRET=<here your GITHUB_CLIENT_SECRET>

13.MICROSOFT_CLIENT_ID=<here your MICROSOFT_CLIENT_ID>
14.MICROSOFT_CLIENT_SECRET=<here your MICROSOFT_CLIENT_SECRET>

15.DISCORD_CLIENT_ID=<here your DISCORD_CLIENT_ID>
16.DISCORD_CLIENT_SECRET=<here your DISCORD_CLIENT_SECRET>

```

## To start the development server, run the following command:
```
npm run dev
```
### Server Auto-Restart with Nodemon 🔄
### Accessing the Server On 🌐 http://localhost:300

<br/>

## Want to run it in a Docker container?
#### Note: Make sure .env file is setup in your root directory before build the docker image, and <a href="https://docker.com">DOCKER</a> installed in your system!

## Build Docker image

```Dockerfile
# Build the app
docker build -t your-image-name .

# Run Docker container for development
docker run -d -p 3000:3000 --name your-container-name your-image-name

# To stop the container
docker stop your-container-name

# To remove the container
docker rm your-container-name

# To remove the image
docker rmi your-image-name
```
### Accessing the Container On 🌐 http://localhost:3000

## OR

## Run Docker Image Without Build It:
#### Note: Make sure .env file is setup in your system before Running the docker image, and <a href="https://docker.com">DOCKER</a> installed in your system!

## Pull the latest version of the notek image
```
docker pull emmraan/notek:latest
```

## OR

## Pull a specific version of the notek image
```
docker pull emmraan/notek:`<version>`  (e.g., 2.2.2)
```
## Run Docker container
```
docker run -d -p 3000:3000 --name `your-container-name` emmraan/notek
```

## Now for Run the container without `MongoUrI` error we have required to copy .env file in docker container
```
docker cp `/path/your/.env/file` <container-name>:/app/.env
or
docker cp `/path/your/.env/file` <container-id>:/app/.env
```

## Now Restart The Container:
```
docker restart <your-container-name> or <your-container_id>
```
### Accessing the Container On 🌐 http://localhost:3000

## To stop the container
```
docker stop your-container-name or your-container_id
```

## To remove the container
```
docker rm your-container-name or your-container_id
```

## To remove the image
```
docker rmi emmraan/notek or image_id
```

## Or, to remove a specific version of the image
```
docker rmi emmraan/notek:<version> (e.g., 2.2.2) or image_id
```

<br/>

## 🌟 Contributing to Notek?

####  First off, thanks for taking the time to contribute! 🎉

## How Can I Contribute? 🤔

### 🐛 Reporting Bugs

If you find a bug in the project, please open an issue by following the bug report template. Provide as much detail as possible to help us resolve the issue quickly.

### 🌟 Suggesting Features

We welcome feature requests! Please follow the feature request template to suggest new features. Be sure to provide enough context and details.

### 🔄 Pull Requests

We love pull requests from everyone. Here’s a quick guide to help you get started:

1. 🍴 Fork the repository.
2. 🌿 Create a branch:  `git checkout -b my-feature-branch`.
3. 🛠️ Make your changes.
4. ✅ Commit your changes: `git commit -m 'Add new feature'`.
5. 🚀 Push to the branch: `git push origin my-feature-branch`.
6. 📥 Open a pull request.

Please ensure your pull request adheres to the pull request template.

## 🖥️ Code Style

- Follow the existing code style and structure.
- Write meaningful commit messages.
- Add comments to your code where necessary.

## 🤝 Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code.