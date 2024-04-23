import { beforeEach, describe, expect, it } from 'vitest'
import { VECTOR_DIRECTION_ENUM } from '../../../../src/Logic/types/vector/vector-utils'
import { TEST_HORIZONTAL_CELLS, TEST_VERTICAL_CELLS } from '../../../TEST_DATA'
import CellVector from '../../../../src/Logic/types/vector/CellVector'
import Cell from '../../../../src/Logic/types/board/Cell'

describe('CellVector', () => {
  const vector = new CellVector()

  describe('Should only be valid if position properties are defined', () => {
    it('Should have undefined position properties if it has less than 2 elements', () => {
      expect(vector.direction).toBe(VECTOR_DIRECTION_ENUM.UNDEFINED)
      expect(vector.start).toBeUndefined()
      expect(vector.end).toBeUndefined()
      expect(vector.index).toBeUndefined()
      expect(vector.isValid).toBeFalsy()

      vector.insert(TEST_HORIZONTAL_CELLS.A)

      expect(vector.direction).toBe(VECTOR_DIRECTION_ENUM.UNDEFINED)
      expect(vector.start).toBeUndefined()
      expect(vector.end).toBeUndefined()
      expect(vector.index).toBeUndefined()
      expect(vector.isValid).toBeFalsy()
    })

    describe('Should have all properties defined, if it has 2 or more elements', () => {
      it('Horizontal Vector', () => {
        const vector_h = new CellVector(
          new Cell(1, 1, { letter: 'A', points: 2 }),
          new Cell(2, 1, { letter: 'B', points: 2 })
        )
        expect(vector_h.isValid).toBeTruthy()
        expect(vector_h.start).toBe(1)
        expect(vector_h.end).toBe(2)
        expect(vector_h.index).toBe(1)
        expect(vector_h.direction).toBe(VECTOR_DIRECTION_ENUM.HORIZONTAL)
      })
      it('Vertical Vector', () => {
        const vector_v = new CellVector(
          new Cell(1, 1, { letter: 'A', points: 2 }),
          new Cell(1, 2, { letter: 'B', points: 2 })
        )
        expect(vector_v.isValid).toBeTruthy()
        expect(vector_v.start).toBe(1)
        expect(vector_v.end).toBe(2)
        expect(vector_v.index).toBe(1)
        expect(vector_v.direction).toBe(VECTOR_DIRECTION_ENUM.VERTICAL)
      })
    })
  })

  describe('includes()', () => {
    it('Should check if the vector includes a specific element', () => {
      const vector = new CellVector(TEST_HORIZONTAL_CELLS.A)

      expect(vector.includes(TEST_HORIZONTAL_CELLS.A)).toBeTruthy()

      expect(vector.includes(TEST_HORIZONTAL_CELLS.B)).toBeFalsy()

      expect(vector.includes(new Cell(1, 1))).toBeFalsy()
    })
  })

  describe('insert()', () => {
    const vector = new CellVector(TEST_HORIZONTAL_CELLS.B)

    it('Should return true or false indicating if the element was inserted', () => {
      expect(vector.insert(TEST_HORIZONTAL_CELLS.C)).toBeTruthy()
      expect(vector.insert(TEST_HORIZONTAL_CELLS.C)).toBeFalsy()
      expect(vector.insert(TEST_VERTICAL_CELLS.C)).toBeFalsy()
      expect(new CellVector().insert(TEST_HORIZONTAL_CELLS.A)).toBeTruthy()
    })

    it('Should not contain the item where insert method returned false', () => {
      expect(vector.toArray().includes(TEST_VERTICAL_CELLS.C)).toBeFalsy()
    })

    it('Should insert the new item in order', () => {
      expect(vector.get(0)).toEqual(TEST_HORIZONTAL_CELLS.B)
      vector.insert(TEST_HORIZONTAL_CELLS.A)
      expect(vector.get(0)).toEqual(TEST_HORIZONTAL_CELLS.A)
    })

    it('Should update position properties on successful insert', () => {
      expect(vector.direction).toBe(VECTOR_DIRECTION_ENUM.HORIZONTAL)
      expect(vector.start).toBe(1)
      expect(vector.end).toBe(3)
      expect(vector.index).toBe(1)

      vector.insert(TEST_HORIZONTAL_CELLS.D)
      expect(vector.direction).toBe(VECTOR_DIRECTION_ENUM.HORIZONTAL)
      expect(vector.start).toBe(1)
      expect(vector.end).toBe(4)
      expect(vector.index).toBe(1)

      //this should not be inserted
      vector.insert(TEST_VERTICAL_CELLS.E)
      expect(vector.direction).toBe(VECTOR_DIRECTION_ENUM.HORIZONTAL)
      expect(vector.start).toBe(1)
      expect(vector.end).toBe(4)
      expect(vector.index).toBe(1)
    })
  })

  describe('removeIndex()', () => {
    it('Should not contain the element after removal', () => {
      const v = new CellVector(TEST_HORIZONTAL_CELLS.A)
      v.removeIndex(0)
      expect(v.length).toBe(0)
    })

    it('Should return the removed element(s)', () => {
      const v = new CellVector(TEST_HORIZONTAL_CELLS.A)
      const el = v.removeIndex(0)
      expect(el).toEqual(TEST_HORIZONTAL_CELLS.A)
    })

    it('Should sequence the vector, and update position properties after removal', () => {
      const v = new CellVector(
        TEST_HORIZONTAL_CELLS.A,
        TEST_HORIZONTAL_CELLS.B,
        TEST_HORIZONTAL_CELLS.C
      )
      expect(v.end).toBe(3)
      v.removeIndex(2)
      expect(v.end).toBe(2)
      v.removeIndex(0)
      expect(v.end).toBe(undefined)
      expect(v.isValid).toBeFalsy()
    })
  })

  describe('remove()', () => {
    it('Should not contain the element after removal', () => {
      const v = new CellVector(TEST_HORIZONTAL_CELLS.A)
      v.remove(TEST_HORIZONTAL_CELLS.A)
      expect(v.length).toBe(0)
    })

    it('Should return the removed element(s)', () => {
      const v = new CellVector(TEST_HORIZONTAL_CELLS.A)
      const el = v.remove(TEST_HORIZONTAL_CELLS.A)
      expect(el).toEqual(TEST_HORIZONTAL_CELLS.A)
    })

    it('Should sequence the vector, and update position properties after removal', () => {
      const v = new CellVector(
        TEST_HORIZONTAL_CELLS.A,
        TEST_HORIZONTAL_CELLS.B,
        TEST_HORIZONTAL_CELLS.C
      )
      expect(v.end).toBe(3)
      v.remove(TEST_HORIZONTAL_CELLS.C)
      expect(v.end).toBe(2)
      v.remove(TEST_HORIZONTAL_CELLS.A)
      expect(v.end).toBe(undefined)
      expect(v.isValid).toBeFalsy()
    })
  })

  describe('removeAll()', () => {
    it('Should return the removed element(s)', () => {
      const v = new CellVector(
        TEST_HORIZONTAL_CELLS.A,
        TEST_HORIZONTAL_CELLS.B,
        TEST_HORIZONTAL_CELLS.C
      )
      const arr = v.removeAll()
      expect(arr).toEqual([
        TEST_HORIZONTAL_CELLS.A,
        TEST_HORIZONTAL_CELLS.B,
        TEST_HORIZONTAL_CELLS.C
      ])
    })

    it('Should update position properties after removal', () => {
      const v = new CellVector(
        TEST_HORIZONTAL_CELLS.A,
        TEST_HORIZONTAL_CELLS.B,
        TEST_HORIZONTAL_CELLS.C
      )
      expect(v.isValid).toBeTruthy()
      v.removeAll()
      expect(v.isValid).toBeFalsy()
    })
  })

  describe('isContinuous', () => {
    it('Should detect if vector is sorted and with no gaps', () => {
      const v = new CellVector(
        TEST_HORIZONTAL_CELLS.A,
        TEST_HORIZONTAL_CELLS.B,
        TEST_HORIZONTAL_CELLS.C,
        TEST_HORIZONTAL_CELLS.D
      )

      expect(v.isContinuous).toBeTruthy()
      v.removeIndex(2)
      expect(v.isContinuous).toBeFalsy()
    })
  })

  //IMPROVE: write more thorough tests
  describe('apply()', () => {
    it('If vector is valid, return the continuous part of the line where the vector is defined', () => {
      const v = new CellVector(
        new Cell(1, 1, { letter: 'A', points: 1 }),
        new Cell(1, 3, { letter: 'C', points: 1 })
      )
      const grid = [
        [
          new Cell(0, 0),
          new Cell(0, 1, { letter: 'X', points: 1 }),
          new Cell(0, 2),
          new Cell(0, 3),
          new Cell(0, 4)
        ],
        [
          new Cell(1, 0),
          new Cell(1, 1, { letter: 'A', points: 1 }),
          new Cell(1, 2, { letter: 'B', points: 1 }),
          new Cell(1, 3, { letter: 'C', points: 1 }),
          new Cell(1, 4, { letter: 'D', points: 1 }),
          new Cell(1, 5)
        ]
      ]
      const result = v.apply(grid)

      expect(result).toEqual([
        new Cell(1, 1, { letter: 'A', points: 1 }),
        new Cell(1, 2, { letter: 'B', points: 1 }),
        new Cell(1, 3, { letter: 'C', points: 1 }),
        new Cell(1, 4, { letter: 'D', points: 1 })
      ])
    })
  })

  describe('getCrossVectorFromSource()', () => {
    const grid = [
      //Col 0
      [
        new Cell(0, 0),
        new Cell(0, 1),
        new Cell(0, 2),
        new Cell(0, 3),
        new Cell(0, 4),
        new Cell(0, 5)
      ],
      //Col 1
      [
        new Cell(1, 0),
        new Cell(1, 1, { letter: 'B', points: 1 }),
        new Cell(1, 2, { letter: 'C', points: 1 }),
        new Cell(1, 3, { letter: 'D', points: 1 }),
        new Cell(1, 4, { letter: 'E', points: 1 }),
        new Cell(1, 5)
      ],
      //Col 2
      [
        new Cell(2, 0),
        new Cell(2, 1, { letter: 'B', points: 1 }),
        new Cell(2, 2, { letter: 'C', points: 1 }),
        new Cell(2, 3),
        new Cell(2, 4),
        new Cell(2, 5)
      ]
    ]
    it('Should return a vertical vector, given an horizontal one', () => {
      const v = new CellVector(
        new Cell(1, 2, { letter: 'C', points: 1 }),
        new Cell(2, 2, { letter: 'C', points: 1 })
      )

      const a = v.getCrossVectorFromSource(grid, 1)
      const b = v.getCrossVectorFromSource(grid, 2)

      expect(a).toEqual(
        new CellVector(
          new Cell(1, 1, { letter: 'B', points: 1 }),
          new Cell(1, 2, { letter: 'C', points: 1 }),
          new Cell(1, 3, { letter: 'D', points: 1 })
        )
      )
      expect(b).toEqual(
        new CellVector(
          new Cell(2, 1, { letter: 'B', points: 1 }),
          new Cell(2, 2, { letter: 'C', points: 1 }),
          new Cell(2, 3)
        )
      )
    })
    it('Should return a horizontal vector, given an vertical one', () => {
      const v = new CellVector(
        new Cell(2, 1, { letter: 'B', points: 1 }),
        new Cell(2, 2, { letter: 'C', points: 1 })
      )

      const a = v.getCrossVectorFromSource(grid, 1)
      const b = v.getCrossVectorFromSource(grid, 2)

      expect(a).toEqual(
        new CellVector(
          new Cell(1, 1, { letter: 'B', points: 1 }),
          new Cell(2, 1, { letter: 'B', points: 1 })
        )
      )
      expect(b).toEqual(
        new CellVector(
          new Cell(1, 2, { letter: 'C', points: 1 }),
          new Cell(2, 2, { letter: 'C', points: 1 })
        )
      )
    })
  })
})
