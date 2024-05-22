# Personal Finance Management Project


## Introduction
Welcome to the Personal Finance Management Project! This application is designed to help users manage their finances efficiently by tracking income, expenses, and savings. It provides insightful visualizations to help users make informed financial decisions.

## Usage
1. Clone the repository to local machine
2. In the root directory which is for backend run the docker build command
3. docker build -t backend-node-app .
4. Run the docker conatiner using this command --> docker run -p 8000:8000 backend-node-app (server should run on 8000 port)
5. Next, navigate to the frontend directory and run the docker build command for the frontend
6. docker build -t frontend-nextjs-app .
7. Run the docker conatiner using this command --> docker run -p 3000:3000 frontend-nextjs-app (server should run on 3000 port)
8. Navigate to http://localhost:3000/ to land on the HomePage of the application


### Test Users created for testing the application
### Test User1 ->
#### userID - test2
#### password - 12345

### Test User2 ->
#### userID - test3
#### password - 12345
