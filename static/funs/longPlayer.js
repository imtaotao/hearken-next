export function testLongPlayer(Hearken) {
  const musicURL = './media/md.mp3'
  const manager = new Hearken.Manager()
  const player = manager.apply(Hearken.LongPlayer)
  const as = manager.apply(Hearken.Visualization)

  window.p = player
  window.h = Hearken
  window.m = manager
  player.add(musicURL)

  manager.context.connect()

  console.log(manager)
}
