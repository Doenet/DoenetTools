# DoenetCourse 🍩
The core libraries underlying the Distributed Open Education Network (Doenet)

## Local Development Setup
### 1. `fork` and `clone` this project
- [_Fork the project on Github_](https://help.github.com/en/github/getting-started-with-github/fork-a-repo)
- `$ cd /path/to/desired/location`
- `$ git clone git@github.com:<your_github_username>/DoenetCourse`
- `$ cd DoenetCourse`

### 2. Install Docker
#### If you have a Desktop Environment (If you don't know what that is, you probably do):
[_Install Docker Desktop_](https://www.docker.com/products/docker-desktop)

_Skip to step 3_

#### If you do not have a DE on your build machine, install docker-engine and docker-compose

- [_Find the instructions to install Docker Engine for your platform here_](https://docs.docker.com/install/)
- Install Docker Compose  
```bash
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```
- Add the execute permission to the docker-compose file
```bash
$ sudo chmod +x /usr/local/bin/docker-compose
```

Hopefully you are now done installing docker.

> Note: If the command `docker-compose` fails after installation, check your path. You can also create a symbolic link to `/usr/bin` or any other directory in your path.

`$ sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose`

### 3. Install dependencies
- Go to the DoenetCourse folder
```bash
$ cd /path/to/desired/location/DoenetCourse
```
- Use NPM to install the build utilities. (Dependencies)
```bash
$ npm install
```

### 4. Build and run the containers!
```bash
$ npm start
```
This may take a while since it must build the containers before you can use them.

You can tell it is ready when the node container outputs a ton of text. It will output similar text after each re-packing.

### 5. Stopping the containers
When you are not using them, you can stop the docker containers by going to the terminal you started them with and using `ctrl+c`. Let the containers stop gracefully. Keep in mind that Webpack takes a while to get going, so you probably don't want to stop the containers until you are done for the day. Or you can leave them running indefinitely.

## Usage
Visit `localhost` in your browser to test the project. When you make changes to the code in the code in `/static` or `/src`, the Docker containers will automatically build the changes and serve the new files. There will be no output to the terminal and you must refresh manually.

### Run the containers
To run the containers, you can just run `$ npm start` in the project's root directory. This command will only build the containers if they are not already built.

### Stop the containers
Option 1: Use `ctrl+c` in the terminal that you started them with.

Option 2: Stop all four containers using whatever docker interface you have. The containers are "node", "apache", "mysql", and "php".

### Re-build the containers.
If you need to re-build the containers for whatever reason, run `$ npm run docker:build`. Not to be confused with `$ npm run build` which will build the website for production.

### Directly access the database
The database is exposed to your local machine by port 3306. You can use a program such as Sequel Pro (Mac), MySQLWorkbench (Most OS), or the MySQL CLI. to interact with the database directly.

If port 3306 is in use, you can change the port in the `docker-compose.yml` file:
```yaml
  mysql:
    build: './mysql'
    ports:
      - 3306:3306
      # - <desired_port>:3306
    volumes:
      - ./volumes/db:/var/lib/mysql
    restart: always
```

### Create a new database template
If you want to save your current database as a template, run the following in bash in your mysql container:

Note: Make sure you don't already have a file in `DoenetCourse/doenet_docker/volumes/db_init/dbdump.sql`. If you do, this command will overwrite it!
```bash
$ mysqldump --all-databases --password=helloworld > /docker-entrypoint-initdb.d/dbdump.sql
```
You can then grab this file from `DoenetCourse/doenet_docker/volumes/db_init/dbdump.sql`.

To use this new template:
1. Stop the docker containers.
2. Rename the dump file to `db_template.sql`.
3. Replace the old `DoenetCourse/doenet_docker/volumes/db_init/db_template.sql` with the newly renamed file.
4. Delete the contents (except for `.gitignore`) of `DoenetCourse/doenet_docker/volumes/db/`.
5. Start the containers:
```bash
$ cd /path/to/local/clone/of/DoenetCourse/doenet_docker
$ docker-compose up --build
```
6. Pet your cat (Optional). :3

### Run only the LAMP stack in Docker
In certain use cases you may only want to run the LAMP stack in docker. For example, you may just want to demonstrate the project with an already present development build but you don't want the jet engine noises that come with starting Webpack (when it runs a full compilation).

To do this:
```bash
$ npm run docker:lamp
```

Usage of the LAMP stack is the same as it is for the full stack Docker composition.

Also keep in mind that the LAMP only uses the same database and database template as the full stack composition. If you want to change anything about the database or database template, follow the same instructions you would for the full stack composition.

### Run only Webpack
In certain cases—such as when you are running your own AMP/NMP stack—you may want to run Webpack on its own. You have two options for this. Inside and outside its own Docker container.

#### Run only Webpack in Docker
```bash
$ npm run docker:webpack
```

#### Run Webpack outside of Docker
```bash
$ npm run webapck
```

### Use your own AMP/NMP stack (advanced)
- Install a webserver that is compatible with PHP, we recommend Apache.
  - We use Apache 2.4.41 in Docker.
- Install PHP.
  - We use PHP 7.4 in Docker, we have also used 7.3.8.
- Install MySQL. You can probably also use MariaDB, but we have not tested that.
  - We use MySQL 7.7.26 in Docker.
- Have your server serve from `/path/to/DoenetCourse/dist_local/`.
  - Use port 3000.
- Initialize your MySQL database with `/path/to/DoenetCourse/doenet_docker/volumes/db_init/db_template.sql`.
  - Use the default port. (3306)
- Run Webpack. Or don't.
  - Use `$ npm run webpack` to run Webpack on your normal namespace (not Docker).  
OR
  - Use `$ npm run docker:webpack` to run Webpack in Docker.

Notes:

You may also get MariaDB to work. Please let us know if you do. c:

We have not tested the current configuration with Nginx, you are on your own if you choose to use it. If you do, we would love to hear about how it turned out. c:

You must use port 3000 for Apache/Nginx or our PHP probably won't work on your stack.

