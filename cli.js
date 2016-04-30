#!/usr/bin/env node
// see https://github.com/babel/babel-eslint/issues/163
var _eslint_workaround = true // eslint-disable-line no-unused-vars

/*
Quick listen.

Copyright 2016
Robin Millette <mailto:robin@millette.info>
<http://robin.millette.info>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the
[GNU Affero General Public License](LICENSE.md)
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict'
// const meow = require('meow')
const aurtier = require('./')

const fs = require('fs')

/*
const cli = meow([
  'Usage',
  '  $ aurtier [input]',
  '',
  'Options',
  '  --foo  Lorem ipsum. [Default: false]',
  '',
  'Examples',
  '  $ aurtier',
  '  unicorns & rainbows',
  '  $ aurtier ponies',
  '  ponies & rainbows'
])
*/

/*
// console.log(aurtier(cli.input[0] || 'unicorns'))
aurtier.getShows('2016-04-01').then((x) => {
  // console.log(JSON.stringify(x, null, ' '))
  aurtier.getEpisodes(x[0].rss).then((x) => {
    // console.log(JSON.stringify(x, null, ' '))
    aurtier.getMP3(x.rss.channel.item[0].enclosure.url)
      .pipe(fs.createWriteStream('heha-2.mp3'))
  })
})
*/

aurtier.getMP3('http://files.gestionradioqc.com/audio/2016/04/01/20160401V7E1K5.mp3')
  .pipe(fs.createWriteStream('heha-3.mp3'))
