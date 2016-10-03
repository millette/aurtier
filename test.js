'use strict'
import test from 'ava'
import fn from './'

const laDate = '2016-10-01'

test('get shows', async t => {
  const result = await fn.getShows(laDate)
  t.is(result.length, 2)
})

test('get episodes', async t => {
  const result0 = await fn.getShows(laDate)
  const result = await fn.getEpisodes(result0[0].rss)
  t.is(result.rss.channel.item.length, 11)
})

test.skip('get mp3', t => {
// test.cb('get mp3', t => {
  fn.getShows(laDate)
    .then(a => fn.getEpisodes(a[0].rss))
    .then(a => {
      console.log('a...')
      let s = fn.getMP3(a.rss.channel.item[0].enclosure.url)
      let len = 0
      s.on('end', () => {
        console.log('end...')
        t.is(len, 5034736)
        t.end()
      })
      s.on('data', d => { len += d.length })
    })
})
