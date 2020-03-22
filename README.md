# DoenetCourse 🍩
The core libraries underlying the Distributed Open Education Network (Doenet)

## Local Development Setup
### 1. `fork` and `clone` this project
- [_Fork the project on Github_](https://help.github.com/en/github/getting-started-with-github/fork-a-repo)
- `$ cd /path/to/desired/location`
- `$ git clone git@github.com:<your_username>/DoenetCourse`
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

`sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose`

### 3. Install dependencies
- Go to the DoenetCourse folder
```bash
$ cd /path/to/desired/location/DoenetCourse
```
- Use NPM to install the build utilities. (Dependencies)
```bash
$ npm install
```

### 4. Build and run the container!
```bash
$ cd docker && docker-compose up
```
This may take a while. 

### 5. Profit
🤑

## Usage
Visit `localhost` in your browser to test the project. When you make changes to the code in the code in `/static` or `/src`, the Docker containers will automatically build the changes and serve the new files. There will be no output to the terminal and you must refresh manually.

To run the container after building, you can just run `docker-compose up` in the root directory.

### Directly access the database
The database is exposed to your local machine by port 3306. You can use a program such as Sequel Pro (Mac), MySQLWorkbench (Most OS), or the MySQL CLI. to interact with the database directly.

If port 3306 is in use, you can change the port in the `docker-compose.yml` file:
```yaml
  mysql:
    build: './mysql'
    ports:
      - 3306:3306
      # - desired_port:3306
    volumes:
      - ./volumes/db:/var/lib/mysql
    restart: always
```

### Create a new database template
If you want to save your current database as a template, run the following in bash in your mysql container:
```bash
$ mysqldump --all-databases --password=helloworld > /docker-entrypoint-initdb.d/dbdump.sql
```
You can then grab this file from `DoenetCourse/docker/volumes/db_init/dbdump.sql`.

To use this new template:
1. Stop the docker containers
2. Rename the dump file to `db_template.sql`
3. Replace the old `DoenetCourse/docker/volumes/db_init/db_template.sql` with the newly renamed file
4. Delete the contents (except for `.gitignore`, `.touch`) of `DoenetCourse/docker/volumes/db/`.
5. Start the containers
```bash
$ cd /path/to/local/clone/of/DoenetCourse
$ docker-compose up --build
```
6. Pet your cat (Optional)

### Use your own AMP/NMP stack
You must use port 3000 for Apache/Nginx or our PHP probably won't work on your stack.
