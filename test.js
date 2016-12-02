'use strict'
import test from 'ava'
import fn from './'

const laDate = '2016-12-01'

test.serial('get shows', async t => {
  const result = await fn.getShows(laDate)
  t.is(result.length, 6)
})

test.serial('get episodes', async t => {
  const result0 = await fn.getShows(laDate)
  const result = await fn.getEpisodes(result0[0].rss)
  t.is(result.rss.channel.item.length, 18)
})

test.cb('get mp3', t => {
  fn.getShows(laDate)
    .then(r0 => fn.getEpisodes(r0[0].rss))
    .then(r1 => fn.getMP3(r1.rss.channel.item[10].enclosure.url))
    .then(s => {
      let len = 0
      t.plan(1)
      s.on('error', console.log.bind(console, 'error'))
      s.on('end', () => {
        t.is(len, 3728617)
        t.end()
      })
      s.on('data', d => {
        len += d.length
      })
    })
})
