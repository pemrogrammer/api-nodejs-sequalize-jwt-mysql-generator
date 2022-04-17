# api-nodejs-sequalize-mysql-2022

[![License](https://poser.pugx.org/laravel/lumen-framework/license.svg)](https://github.com/yogithesymbian)

```
git clone https://github.com/pemrogrammer/api-nodejs-sequalize-jwt-mysql-generator.git
```

# TODO

- [X] refactor location with module aliases in `.vscode/*.code-snippets`
- [X] split bash script generator for maintainable | flexible
- [X] Api repository pattern ( like laravel or lumen using a league fractal transformer etc ) <br/>
- [X] Change all core feature with module aliases <br/>
- [x] use `authJwt.verifyToken` of middleware, your all request have req.user_id , make automaticaly or middleware for default request by user_id or their foreign_key like a magic on laravel

- [X] Redis for user<br/>
- [X] Enhancement for bash script on GENERATE CRUD <br/>
- [X] Enhancement for snippet code (vscode) <br/>
- [X] Multiple Database <br/>
- [X] Flexible Database ( choose driver mysql or oracle ) <br/>
- [X] i18n (english, indonesia, japan, arabic & china) <br/>
- [X] Docker File <br/>

<br/>

# FEATURED

- Generator CRUD [bash script].
  - create (POST) , read (GET), update (PUT) , and delete (DELETE).
- Module Aliases.
- FILE [middleware].
  - XLSX (excel) to database.
  - Upload Image.
- Request.
  - Authentication [ available for email & password or username & password ].
  - Roles & Abilities [middleware, crud].
  - Manage Users [crud].
    - update data with new_password or just update other information.
- good response ( snake_case on everything's response )

<br/><br/>

# CONFIGURATION OR TRICKY

## Extension | PLUGIN  (vscode)

1. GitLens, Enumerator, Code Spell Checker
2. Import Cost, Path Intellisense, Path Autocomplete
3. Thunder Client, vscode-random, etc.
<br/>
<br/>

## SNIPPET (.VSCODE)

for snippet just type the folder name first to trigger what for todo for example if you are in `auth.controller` we already known the folder is `controllers` so just type `cont` will trigger what todo.<br/><br/>

## ALIASES .zsrhc | .bshrc

```
alias nsc="npx sequelize-cli"
<!-- FOR MODEL -->
alias nsc-m-generate="npx sequelize-cli model:generate --name"
alias nsc-migrate="npx sequelize-cli db:migrate"
alias nsc-migrateu="npx sequelize-cli db:migrate:undo:all"

<!-- FOR SEEDER -->
alias nsc-s-generate="npx sequelize-cli seed:generate --name"
alias nsc-seeder="npx sequelize-cli db:seed:all"
alias nsc-seederu="npx sequelize-cli db:seed:undo:all"

# sometimes on seeder have an error, try with these migrate + seeder in one time execute
<!-- FOR RE-MIGRATE WITH SEEDER GENERATE ALL -->
alias nsc-migrates="nsc-migrateu && nsc-migrate && nsc-seeder"

OR

npm run db:reset
```

<br/>

# RUNNING

1. `cd api-nodejs-sequalize-mysql-2022`
2. `nsc-migrates`
3. `npm run dev`
<br/><br/>

# GENERATOR CRUD

there is have 2 file of bash script for generate file and code automatic `yo-gen.sh` and `light-yo-gen.sh`

```
chmod +x yo-gen.sh
./yo-gen.sh
```

```
chmod +x light-yo-gen.sh
./light-yo-gen.sh
```

output

```
1) generate model & migration
2) generate model & migration ( with state_condition )
3) generate model & migration ( with core_relation )
4) generate model & migration ( with core_relation + state_condition )
5) generate controller & router
6) generate controller & router ( with state_condition )
7) generate controller & router ( with core_relation )
8) generate controller & router ( with core_relation + state_condition )
9) Quit
Please enter your choice:
```

<br/>

# DEFAULT ENDPOINT

`/api/auth/signup`

```
raw json
{
    "email": "yogiarifwidodo@yogithesymbian.id",
    "password": "password",
    "roles": [
        {
            "role_id": 1 // we have 4 roles
        }
    ]
}
```

`/api/auth/signin`

```
raw json
{
    "email": "yogiarifwidodo@yogithesymbian.id",
    "password": "password"
}
```

see more default endpoint, click here.
<br/>
<br/>

# Middleware Routes

## ACL

| # | #  | #  |
| ------- | --- | --- |
| isSuperAdmin | isAdmin | isOperator |
| isModerator | isModeratorOrAdmin | - |

---

## VALIDATION

| # | #  | #  |
| ------- | --- | --- |
| checkDuplicateUsernameOrEmail | checkRolesExisted | - |
| - | - | - |

---

## FILE UPLOAD

| # | #  | #  |
| ------- | --- | --- |
| isImage | isCsv | isExcel |
| - | - | - |

<br/>

# OTHER CONFIGURATION | Aliases

***package.json***

```
  "_moduleAliases": {
    "@root": ".",
    "@config": "src/config",
    "@controllers": "src/controllers",
    "@db": "src/db",
    "@middleware": "src/middleware",
    "@routes": "src/routes",
    "@utils": "src/utils"
  },
```

# Preview Controller

  ```
// create
app.post("/api/user",
    [
      authJwt.verifyToken, authJwt.isSuperAdmin,
      verifySignUp.checkDuplicateUsernameOrEmail,
    ],
    controller.user_create
);
  ```

1. `/api/test/all` public access
2. `/api/test/user` user access
3. `/api/test/mod` moderator access
4. `/api/test/admin` admin access

----

### HEADER

`x-access-token :` `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjA2MDE1NjU5LCJleHAiOjE2MDYxMDIwNTl9.pUya-Wqm8sVmadkxfGvYL7N0Y3d-18dT3IaZtSLUMS4`
<br/><br/>

# HOW TO DEPLOYMENT [APACHE/NGINX]

### #1 with Aliyun Linux Server | vultr | etc

```
#/etc/systemd/system/api-nodejs-sequelize-2022.service

Description = api-nodejs-sequelize-2022.service
After network.target = api-nodejs-sequelize-2022.service

[Service]
ExecStart=/usr/bin/npm run dev /var/www/html/api/yo-api-nodejs/server.js
Restart=on-failure
StandardOutput=syslog
StandardError=syslog

SyslogIdentifier=api-nodejs-sequelize-2022
User=nobody
Group=root

Environment=NODE_ENV=production PORT=5001
WorkingDirectory=/var/www/html/api/yo-api-nodejs

[Install]
WantedBy=multi-user.target
```

Then run the following to start both instances of our node application

`$ systemctl start api-nodejs-sequelize-2022`
The first instance will be accepting requests at port 5000, where as the other one at port 5001. If any of them crashes it will automatically be restarted.

To make your node app instances run when the server starts do the following

`$ systemctl enable api-nodejs-sequelize-2022`
In case there are problems with any of the following commands above you can use any of these two:

```
sudo systemctl status api-nodejs-sequelize-2022 -n 100 --no-pager
sudo journalctl -u api-nodejs-sequelize-2022 -n 100 --no-pager
```

The first line will show your app instance current status and whether it is running. The second command will show you all logging information including output on standard error and standard output streams from your instance.

Use the first command right now to see whether your app is running or whether there has been some problem starting it.

Re-deploying your app
With the current setup, if we have some new application code in our repository, all you have to do is the following

```
cd /opt/app
git pull
sudo systemctl restart api-nodejs-sequelize-2022
```

## firewall

```
sudo ufw allow 5001 // execute to allow on port
sudo ufw status verbose // status
```

<br/><br/>

# HOW TO DEPLOYMENT [third apps]

### #2 with HEROKU

Start your app locally using the heroku local command, which is installed as part of the Heroku CLI.
`heroku local web`

```
/node_modules
npm-debug.log
.DS_Store
/*.env
```

Deploy your application to Heroku
After you commit your changes to git, you can deploy your app to Heroku.

```
git add .
git commit -m "Added a Procfile."
heroku login
Enter your Heroku credentials.
...
heroku create
Creating arcane-lowlands-8408... done, stack is cedar
http://arcane-lowlands-8408.herokuapp.com/ | git@heroku.com:arcane-lowlands-8408.git
Git remote heroku added
git push heroku master
...
-----> Node.js app detected
...
-----> Launching... done
       http://arcane-lowlands-8408.herokuapp.com deployed to Heroku
```
