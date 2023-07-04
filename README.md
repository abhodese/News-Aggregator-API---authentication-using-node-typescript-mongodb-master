<h1 align="center">Authentication using nodejs,typescript and mongodb + news aggregator APO </h1>

## :information_source: About
A Node application for authentication using typescript,express and mongoDB which incorporates async/await and Promises in the process of fetching news data and filtering it based on user preferences.
![1_NFt9edTKLJ-zL6yTdTX0nA](https://user-images.githubusercontent.com/31761132/73010697-b4c12600-3e34-11ea-8216-bfe2f40856da.png)



## :hammer: Technologies Used
 
- typescript
- express
- mongoDB
- jsonwebtoken
- lodash
- bcryptjs
- axios
- dotenv
- eslint


## :rocket: Installation
1. Get the code

    ```bash
    git clone git@github.com:AurangzaibRamzan/authentication-using-node-typescript-mongodb.git && cd authentication-using-node-typescript-mongodb
    ```

2. Install dependencies

    ```bash
    npm install
    ```


3. Starts the development server
   
   ```bash
    npm run dev
    ```

4. Starts the production server
   
   ```bash
    npm run start
    ```

5. Runs the linter.
   
   ```bash
    npm run lint
    ```

     ```bash
    npm run lint-fix
    ```

## :twisted_rightwards_arrows:: Routes

1. http://localhost:3000/user/signup
2. http://localhost:3000/user/login
3. http://localhost:3000/user/    (with token in header i.e header :{token:""})
4. http://localhost:3000/user/changepassword
5. http://localhost:3000/user/preferences
6. http://localhost:3000/user/news
7. http://localhost:3000/user/news/:id
8. http://localhost:3000/user/news/:id/read
9. http://localhost:3000/user/news/:id/favourite
10. http://localhost:3000/user/news/:id/favourites









    
    
