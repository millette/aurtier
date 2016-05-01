# aurtier
[![Build Status](https://travis-ci.org/millette/aurtier.svg?branch=master)](https://travis-ci.org/millette/aurtier)
[![Coverage Status](https://coveralls.io/repos/github/millette/aurtier/badge.svg?branch=master)](https://coveralls.io/github/millette/aurtier?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/millette/aurtier.svg)](https://gemnasium.com/github.com/millette/aurtier)
> Quick listen.

## Install
```
$ npm install --save aurtier
```

## Usage
```js
const aurtier = require('aurtier')

aurtier('unicorns')
//=> 'unicorns & rainbows'
```

## API
### aurtier(input, [options])
#### input
Type: `string`

Lorem ipsum.

#### options
##### foo
Type: `boolean`<br>
Default: `false`

Lorem ipsum.

## CLI
```
$ npm install --global aurtier
```

Choisissez les émissions, choisissez les épisodes, et écoutez.

```
$ aurtier --help

  Usage
    aurtier [input]

  Options
    --speed  Lorem ipsum. [Default: 2]

  Examples
    $ aurtier
    # émission d'aujourd'hui à 2 fois la vitesse, par défaut
    $ aurtier 2016-04-25 --speed 1.5
    # émission du 25 avril à 1.5 fois la vitesse
```

## TODO
* if nothing is available today, fetch yesterday when started with no date argument
* how to improve test coverage?
* speed up above 2x

## License
AGPL-v3 © [Robin Millette](http://robin.millette.info)
