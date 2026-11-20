// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 the Ratchet contributors
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';
import { normalizeText } from '../../src/lib/ids.js';

const RUNS = Number(process.env.FUZZ_RUNS ?? 2000);

describe('normalizeText: properties that must hold for every string', () => {
  test('it never throws, whatever string it receives', () => {
    fc.assert(fc.property(fc.string(), (value) => {
      assert.doesNotThrow(() => normalizeText(value));
    }), { numRuns: RUNS });
  });

  test('normalising an already normalised string changes nothing', () => {
    fc.assert(fc.property(fc.string(), (value) => {
      const normalized = normalizeText(value);
      assert.equal(normalizeText(normalized), normalized);
    }), { numRuns: RUNS });
  });

  test('canonically equivalent NFC and NFD strings normalise together', () => {
    fc.assert(fc.property(fc.string(), (value) => {
      const nfc = value.normalize('NFC');
      const nfd = value.normalize('NFD');
      assert.equal(normalizeText(nfc), normalizeText(nfd));
    }), { numRuns: RUNS });
  });

  test('distinct NFC forms remain distinct', () => {
    fc.assert(fc.property(fc.string(), fc.string(), (left, right) => {
      fc.pre(left.normalize('NFC') !== right.normalize('NFC'));
      assert.notEqual(normalizeText(left), normalizeText(right));
    }), { numRuns: RUNS });
  });
});
