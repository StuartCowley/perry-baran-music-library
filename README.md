# Music-Library

An Express.js API that interacts with a mySQL database via CRUD requests to store and interact with data containing artists and albums information.

Implements Test-Driven development using Mocha and Chai.

Created as part of the Manchester Codes full-stack web development boot-camp.

## Table of Contents

1. [Dependencies](#dependencies)
2. [Setup](#setup)
3. [Routes](#routes)
4. [Attribution](#attribution)

## Dependencies

- [Express.js](https://expressjs.com/)
- [MySQL2](https://www.npmjs.com/package/mysql2)

### Dev Dependencies

- [Nodemon](https://www.npmjs.com/package/nodemon)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [Mocha](https://www.npmjs.com/package/mocha)
- [Chai](https://www.npmjs.com/package/chai)
- [Supertest](https://www.npmjs.com/package/supertest)
- [Faker](https://www.npmjs.com/package/@faker-js/faker)
- [sinon](https://www.npmjs.com/package/sinon)

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

### /artist

#### POST /artist

Creates a new artist. Body must be sent as JSON following this schema:

```
{
    "name": STRING,
    "genre": STRING
}
```

#### GET /artist

return all artists.

#### GET /artist/{artistId}

Gets the artist with the specifed ID.

#### PATCH /artist/{artistId}

Updates an artist with the specified ID when passed JSON follwing this schema. `?` denotes optional variables:

```
{
    "name"?: STRING,
    "genre"?: STRING
}
```

#### DELETE /artist/{artistId}

Deletes the artist with the specified ID and all associated albums and songs.

#### POST /artist/{artistId}/album

Creates a new album and links it to the artist with the specified ID, when passed a JSON body that follows the following schema:

```
{
    "name": STRING,
    "year": INTEGER
}
```

#### GET /artist/{artistId}/album

Gets all albums that are linked with the artist with the specified ID.

#### GET /artist/{artistId}/song

Gets all songs that are linked with the artist with the specified ID.

### /album

#### GET /album

returns all albums.

#### GET /album/{albumId}

Gets the album with the specified ID.

#### PATCH /album/{albumId}

Updates an album with the specified ID when passed JSON following this schema. `?` denotes optional variables::

```
{
    "name"?: STRING,
    "year"?: INTEGER
}
```

#### DELETE /album/{albumId}

Deletes the album with the specified ID.

#### POST /album/{albumId}/song

Creates a new song and links it to the album with the specified ID, when passed a JSON body that follows the following schema:

```
{
    "name": STRING,
    "position": INTEGER
}
```

#### GET /album/{albumId}/song

Gets all songs that are linked with the album with the specified ID.

### /song

#### GET /song

returns all songs.

#### GET /song/{songId}

Gets the song with the specified ID.

#### PATCH /song/{songId}

Updates the song with the specified ID when passed JSON following this schema. `?` denotes optional variables::

```
{
    "name"?: STRING,
    "position"?: INTEGER
}
```

#### DELETE /song/{songId}

Deletes the song with the specified ID.

## Attribution

Created by **Perry Baran**.
