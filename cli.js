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
const meow = require('meow')
const aurtier = require('./')

// npm
const inquirer = require('inquirer')

const cli = meow([
  'Usage',
  '  $ aurtier [date]',
  '',
  'Options',
  '  --speed  Lorem ipsum. [Default: 2]',
  '',
  'Examples',
  '  $ aurtier',
  '  ... (?)',
  '  $ aurtier 2016-04-20',
  '  ... (?)'
], { default: { 'num': '2' } })

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
          const pl = (ep) => {
            if (!ep) { return }
            console.log(`${ep.title} (${ep.duration / 1000}s)`)
            console.log(ep.date)
            const speed = parseFloat(cli.flags.speed, 10)
            aurtier.playMP3(ep.mp3, ep.duration, speed, () => pl(episodes.shift()))
          }
          pl(episodes.shift())
        })
    })
})
  .catch((e) => {
    console.log('ERROR:', e)
  })
