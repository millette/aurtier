# aurtier
[![Build Status](https://travis-ci.org/millette/aurtier.svg?branch=master)](https://travis-ci.org/millette/aurtier)
[![Coverage Status](https://coveralls.io/repos/github/millette/aurtier/badge.svg?branch=master)](https://coveralls.io/github/millette/aurtier?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/millette/aurtier.svg)](https://gemnasium.com/github.com/millette/aurtier)
> Quick listen.

## Install
```
$ npm install --save aurtier
```

## New since version 0.1.0
The cli now uses [update-notifier][] to let the user know about updates to this program.

Users have the ability to opt-out of the update notifier by changing
the optOut property to true in ~/.config/configstore/update-notifier-rollodeqc-gh-user-streak.json.
The path is available in notifier.config.path.

Users can also opt-out by setting the environment variable NO_UPDATE_NOTIFIER
with any value or by using the --no-update-notifier flag on a per run basis.

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
    --download
    --download=OUTPUT_DIRECTORY

  Examples
    $ aurtier
    # émission d'aujourd'hui à 2 fois la vitesse, par défaut
    $ aurtier 2016-04-25 --speed 1.5
    # émission du 25 avril à 1.5 fois la vitesse
```

## TODO
* how to improve test coverage?
* speed up above 2x

## License
AGPL-v3 © [Robin Millette](http://robin.millette.info)

[update-notifier]: <https://github.com/yeoman/update-notifier>
