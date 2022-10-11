# Music-Library

An Express.js API that interacts with a mySQL database via CRUD requests to store and interact with data containing artists and albums information.

Implements Test-Driven development using Mocha and Chai.

Created as part of the Manchester Codes full-stack web development boot-camp.

## Dependencies

- [Express.js](https://expressjs.com/)
- [MySQL2](https://www.npmjs.com/package/mysql2)

### Dev Dependencies

- [Nodemon](https://www.npmjs.com/package/nodemon)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [Mocha](https://www.npmjs.com/package/mocha)
- [Chai](https://www.npmjs.com/package/chai)
- [Supertest](https://www.npmjs.com/package/supertest)

## Setup

### Install Dependencies

```
$ npm i
```

### Database

If you have [Docker](https://docs.docker.com/) installed, To set the database up, pull and run a MySQL image with:

```
$ docker run -d -p 3307:3306 --name music_library_mysql -e MYSQL_ROOT_PASSWORD=password mysql
```

### Environment variables

You will need to create a file to store your enviroment variables. These credentials allow you to connect to the database. Two enviroments will need to be created, one for production and one for testing.

Create a `.env` file in the root of the repo with the following values:

```
DB_PASSWORD=password
DB_NAME=music_library_dev
DB_USER=root
DB_HOST=localhost
DB_PORT=3307
PORT=3000
```

Create a `.env.test` file in the root of the repo with the following values:

```bash
DB_PASSWORD=password
DB_NAME=music_library_test
DB_USER=root
DB_HOST=localhost
DB_PORT=3307
PORT=3000
```

### Git Ignore

Create a `.gitignore` file. This can be done automatically using `npx gitignore node`, or by manually creating it.

Make sure that your `.gitignore` file includes `node_modules`, `.env` and `.env.test`.

## Commands

To run the server use:

```
$ npm start
```

To run unit tests use:

```
$ npm test
```

To run prettier use:

```
$ npm run prettier
```

## Routes

### GET /artist

return all artists.

### POST /artist

Creates a new artist. Body must be sent as JSON following this schema:

```
{
    "name": STRING,
    "genre": STRING
}
```

### GET /artist/{artistId}

Gets the artist with the specifed ID.

### PATCH /artist/{artistId}

Updates an artist with the specified ID when passed JSON follwing this schema. `?` denotes optional variables:

```
{
    "name"?: STRING,
    "genre"?: STRING
}
```

### DELETE /artist/{artistId}

Deletes the artist with the specified ID and all associated albums.

### POST /artist/{artistId}/album

Creates a new album that was created by the artist with the specified ID, when passed a JSON body that follows the following schema:

```
{
    "name": STRING,
    "year": INTEGER
}
```

### GET /artist/{artistId}/album

Gets all albums that are assoccciated with the artist with the specified ID.

### GET /album

returns all albums.

### GET /album/{albumId}

Gets all albums with the specified ID.

### PATCH /album/{albumId}

Updates an album with the specified ID when passed JSON following this schema. `?` denotes optional variables::

```
{
    "name"?: STRING,
    "year"?: INTEGER
}
```

### DELETE /album/{albumId}

Deletes an album with the specified ID.

## Attribution

Created by **Perry Baran**.
