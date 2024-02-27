// Extend these specs as you like

const scrabble = require('../../src/scrabble')

describe('Scrabble', () => {
  describe('letter multipliers', () => {
    it('returns 6 for double letter o', () => {
      expect(scrabble('d{o}g')).toEqual(6)
    })

    it('returns 6 for triple letter o', () => {
      expect(scrabble('d[o]g')).toEqual(7)
    })

    it('returns 0 for invalid multiplier', () => {
      expect(scrabble('d{og')).toEqual(0)
    })

    it('returns 0 for invalid multiplier', () => {
      expect(scrabble('do}g')).toEqual(0)
    })
  })

  describe('word multipliers', () => {
    it('returns 10 for double letter o', () => {
      expect(scrabble('{dog}')).toEqual(10)
    })

    it('returns 15 for triple letter o', () => {
      expect(scrabble('[dog]')).toEqual(15)
    })

    it('returns 0 for invalid multiplier', () => {
      expect(scrabble('{dog')).toEqual(0)
    })
    it('returns 0 for invalid multiplier', () => {
      expect(scrabble('dog}')).toEqual(0)
    })
  })

  describe('edge cases', () => {
    it('returns 18 for letter and word multiplier', () => {
      expect(scrabble('{[d]og}')).toEqual(18)
    })

    it('returns 30 for two word multipliers', () => {
      expect(scrabble('[{dog}]')).toEqual(30)
    })
    it('returns 9 for two end letter multipliers', () => {
      expect(scrabble('{d}o{g}')).toEqual(9)
    })

    it('returns 0 for incorrect tokens', () => {
      expect(scrabble('|d|og')).toEqual(0)
    })
  })
})
