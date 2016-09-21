/*eslint arrow-parens: [2, "as-needed"]*/
'use strict'
import test from 'ava'
import fn from './'

test('get shows', async t => {
  const result = await fn.getShows('2016-09-19')
  t.is(result.length, 6)
})

test('get episodes', async t => {
  const result0 = await fn.getShows('2016-09-19')
  const result = await fn.getEpisodes(result0[0].rss)
  t.is(result.rss.channel.item.length, 17)
})

test.skip('get mp3', t => {
// test.cb('get mp3', t => {
  fn.getShows('2016-06-24')
    .then(a => fn.getEpisodes(a[0].rss))
    .then(a => {
      let s = fn.getMP3(a.rss.channel.item[0].enclosure.url)
      let len = 0
      s.on('end', () => {
        t.is(len, 5034736)
        t.end()
      })
      s.on('data', d => { len += d.length })
    })
})
