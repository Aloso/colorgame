const victoryMessages = [
  'Gut gemacht!',
  'Sieg!',
  'Super!',
  'Superb!',
  'Fabelhaft!',
  'Aus&shy;ge&shy;zeichnet!',
  'Brilliant!',
  'Fantas&shy;tisch!',
  'Großartig!',
  'Grandios!',
  'Meister&shy;haft!',
  'Unglaublich!',
  'Prächtig!',
  'Beein&shy;druckend!',
  'Genial!',
  'Wunderbar!',
  'Atem&shy;beraubend!',
  'Sagenhaft!',
  'Herrlich!',
  'Rekord&shy;verdächtig!',
  'Eine Glanz&shy;leistung!',
  'Mir fehlen die Worte!',
  'Du bist der_die Beste!',
  'Super&shy;kali&shy;fragi&shy;lis&shy;tig&shy;ex&shy;pi&shy;ali&shy;ge&shy;tisch!',
]

export function randomVictoryMessage() {
  const n = (Math.random() * victoryMessages.length) | 0
  return victoryMessages[n % victoryMessages.length]
}

export function shortVictoryMessage() {
  const short = victoryMessages.filter(m => m.replace(/&shy;/g, '').length < 11)
  const n = (Math.random() * short.length) | 0
  return short[n % short.length]
}
