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

// self
const pkg = require('./package.json')

// npm
const got = require('got')
const xml2js = require('xml2js')
const FfmpegCommand = require('fluent-ffmpeg')
const ProgressBar = require('progress')
const iconv = require('iconv')

const ic = new iconv.Iconv('iso-8859-1', 'utf-8')
const parserOptions = { explicitArray: false, mergeAttrs: true, normalize: true }
const mois = [ 'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre' ]
const headers = {
  'referer': 'http://www.985fm.ca/baladodiffusion.php',
  'user-agent': `${pkg.name} (wip v${pkg.version})`
}

const rss = (show) => {
  if (!show.div[2] || !show.div[2].a) { return false }
  return {
    img: show.div[0].img.src,
    name: show.div[1].h3._,
    extracts: parseInt(show.div[1].p[0]._, 10),
    minutes: parseInt(show.div[1].p[1]._, 10),
    rss: show.div[2].a
      .filter((x) => x._ === 'RSS')[0].href
  }
}

exports.getShows = (d) => {
  const date = d ? new Date(d) : new Date()
  const body = {
    dateText: `, ${date.getUTCDate()} ${mois[date.getUTCMonth()]}, ${date.getUTCFullYear()}`
  }
  return got.post('http://www.985fm.ca/inc/ajax/balado-reloadAudios.php',
    { encoding: null, headers: headers, body: body })
    .then((x) => ic.convert(x.body).toString('utf-8'))
    .then((x) => new Promise((resolve, reject) => {
      const parser = new xml2js.Parser(parserOptions)
      parser.parseString(`<stuff>${x}</stuff>`,
        (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result.stuff.div)
          }
        }
      )
    }))
    .then((x) => x.length ? x : [x])
    .then((x) => x.map(rss).filter((x) => x))
}

exports.getLatestShows = () => exports.getShows().then((shows) => {
  if (shows.length) { return shows }
  return exports.getShows(new Date().toLocaleDateString())
})

exports.getEpisodes = (rss) => got(rss, { headers: headers })
  .then((x) => x.body)
  .then((x) => new Promise((resolve, reject) => {
    const parser = new xml2js.Parser(parserOptions)
    parser.parseString(x,
      (err, result) => err ? reject(err) : resolve(result))
  }))

exports.getMP3 = (mp3url) => got.stream(mp3url, { encoding: null, headers: headers })

exports.playMP3 = (mp3url, total, speed, cb) => {
  if (typeof cb !== 'function') {
    cb = (a, b, c) => console.log('CB:', a, b, c)
  }
  speed = Math.min(Math.max(speed || 2, 0.5), 2)

  const pb = new ProgressBar('Playing [:bar] :percent', { total: 100 })
  let pos = 0
  const progress = (o) => {
    const percent = Math.round(1000 * new Date('1970-01-01T' + o.timemark).getTime() / (total / speed)) / 10
    if (pb) { pb.tick(percent - pos) }
    pos = percent
  }
  return new FfmpegCommand(exports.getMP3(mp3url))
    .audioFilters('atempo=' + speed)
    .format('pulse')
    .output('spedup')
    .on('progress', progress)
    .on('end', cb.bind(null, mp3url, total, speed))
    .run()
}
