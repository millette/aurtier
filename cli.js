#!/usr/bin/env node

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
const aurtier = require('./')

// core
const fs = require('fs')
const path = require('path')
const url = require('url')

// npm
const meow = require('meow')
const inquirer = require('inquirer')
const updateNotifier = require('update-notifier')

updateNotifier({ pkg: require('./package.json') }).notify()

const cli = meow([
  'Usage',
  '  $ aurtier [date]',
  '',
  'Options',
  '  --speed=1 Playback speed. [Default: 2]',
  '  --download',
  '  --download=OUTPUT_DIRECTORY',
  '',
  'Examples',
  '  $ aurtier',
  '  ... (?)',
  '  $ aurtier 2016-04-20',
  '  ... (?)'
], {
  default: { 'speed': '2' },
  boolean: true
})

const p = cli.input[0] ? aurtier.getShows(cli.input[0]) : aurtier.getLatestShows()

p.then((x) => {
  if (!x.length) {
    console.log('Rien encore à cette date.')
    return
  }
  const shows = x.map((em) => {
    return {
      name: `${em.name} (${em.minutes} minutes dans ${em.extracts} extraits)`,
      value: em.rss,
      short: em.name
    }
  })
  shows.push(new inquirer.Separator())
  shows.push({ name: 'EXIT', value: false, short: 'CIAO!' })
  inquirer.prompt([{
    type: 'list',
    name: 'rss',
    message: 'Quelle émission?',
    choices: shows
  }])
    .then((answers) => answers.rss ? aurtier.getEpisodes(answers.rss) : false)
    .then((episodes) => {
      if (!episodes) { return }
      return episodes.rss.channel
    })
    .then((eps) => {
      if (!eps) { return }
      console.log(eps.copyright)
      if (!eps.item.length) { eps.item = [eps.item] }

      const episodes = eps.item.map((em) => {
        return {
          name: `${em.title} (${em['itunes:duration']})`,
          short: em.title,
          value: {
            title: em.title,
            date: new Date(em.pubDate),
            mp3: em.enclosure.url,
            duration: new Date('1970-01-01T' + em['itunes:duration']).getTime(),
            length: parseInt(em.enclosure.length, 10)
          }
        }
      })

      inquirer.prompt([{
        type: 'checkbox',
        name: 'episodes',
        message: eps.description,
        choices: episodes
      }])
        .then((answers) => answers.episodes)
        .then((episodes) => {
          if (cli.flags.download) {
            episodes.forEach((ep) => {
              console.log(ep.title)
              const parsedURL = url.parse(ep.mp3)
              const filename = (
                cli.flags.download === true ? '.' : cli.flags.download
              ) + '/' + path.basename(parsedURL.pathname)
              const writeStream = fs.createWriteStream(filename)
              aurtier.getMP3(ep.mp3).pipe(writeStream)
            })
          } else {
            const pl = () => {
            // const pl = (ep) => {
              const ep = episodes.shift()
              if (!ep) { return }
              console.log(`${ep.title} (${ep.duration / 1000}s)`)
              console.log(ep.date)
              const speed = parseFloat(cli.flags.speed, 10)
              aurtier.playMP3(ep.mp3, ep.duration, speed, () => pl())
              // aurtier.playMP3(ep.mp3, ep.duration, speed, () => pl(episodes.shift()))
            }
            pl()
            // pl(episodes.shift())
          }
        })
    })
})
  .catch((e) => {
    console.log('ERROR:', e)
  })
