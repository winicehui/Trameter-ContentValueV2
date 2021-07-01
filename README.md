# Trameter - Content Value Web Application
Developing a powerful internal tool to capture and evaluate the value people perceive from our content by tracking the intended job a social media post is aiming to achieve, and what it actually achieves; Modeled after Buzzfeed's concept of Cultural Cartography (https://www.treeshake.com/twig/what-makes-content-go-viral)

### Online
Firebase Hosting URL:
```
https://contentvalue-8195c.web.app/
```
## Terminology
* Content: The content of a post that is shared to social media platforms
* Job (Ex: 'Humor', 'This is me'): The result that the content is doing for the reader or the viewer 

## Functionalities (see Video Below for more information)
* CRUD operations (Add, Edit, Delete content; Increment/Decrement job counts)
* Real time updates (with Firebase)
* Filtering by job type
* Basic text search
* URL Routing (URL path parameters for job)

https://user-images.githubusercontent.com/35130094/124191956-67110a00-da79-11eb-9efe-06b4998e140d.mp4

## Set-up

### Requirements
1. Node.js & NPM <br>
https://nodejs.org/en/download/ <br> 
https://www.npmjs.com/get-npm

### Installation
1. Clone repository onto local machine.
2. Navigate to local respository folder in Terminal.
3. Install dependencies by running  "npm install".

### Run Project Locally
1. Navigate to respository folder in Terminal.
2. Run: "npm start". 
3. Navigate to "localhost:3000" on local web browser to see the application running locally on your machine.

## Pushing Edits

### To push edits to Github respository: 
1. Add files you would like to push, or run: "git add ."
2. Run: "git commit -m "commit-message""
3. Run: "git push"

### To deploy edits to Firebase:
1. Run "npm run build" in Terminal. 
2. Run "firebase deploy -m message" in Terminal.
