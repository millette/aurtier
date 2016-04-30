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

```
$ aurtier --help

  Usage
    aurtier [input]

  Options
    --foo  Lorem ipsum. [Default: false]

  Examples
    $ aurtier
    unicorns & rainbows
    $ aurtier ponies
    ponies & rainbows
```


## License
AGPL-v3 © [Robin Millette](http://robin.millette.info)
