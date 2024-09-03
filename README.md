# Project setup steps

Prerequisites: Install NodeJS v20.10.0 ,NPM 10.4.0 AND mySQL
```
npm install
```

### Add/Configure .env file into the root directory

```
# Sample .env

# AWS S3 credentials
IAM_USER_KEY = "AK**************W5"
IAM_USER_SECRET = "m***********************Dd"
BUCKET_NAME = "chatapp9875"


# DB credentials
DB_NAME="chatApp"
DB_USER="******"
DB_PSD="******"
DB_HOST="******"


# Application port
PORT=4002

# JWT and CRYPT secret for encryption
tokenSecret = "a*************************************************************************************07a0"

# List of accepted origins for CORS
ACCEPTED_ORIGINS = '["http://localhost"]'
```

### To Sync DB
```
//Inside app.js: uncomment below

await sequelize.sync({force: true});
 
```

### Start Server
```

npm start

```
