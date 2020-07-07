![build](https://github.com/imtaotao/hearken-next/workflows/build/badge.svg)
[![Coverage](https://img.shields.io/codecov/c/github/imtaotao/hearken-next/master.svg)](https://codecov.io/github/imtaotao/hearken-next?branch=master)

## start
```bash
# development
$ yarn dev -o
# build
$ yarn build
```

## demo
```js
  import Hearken, { player, pitchShift } from '@hearken'

  const manager = new Hearken({})

  // inject plugin nodes
  manager.connect.on(() => {
    manager.connect(player)
    manager.connect(pitchShift)
  })

  // load audio source
  manager.add('xxx.mp3')

  // play music
  if (manager.canplay()) {
    manager.plugins.player.start()
  } else {
    manager.canplay.on(() => {
      manager.plugins.player.start()
    })
  }
```
