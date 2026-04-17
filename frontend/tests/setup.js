import '@testing-library/jest-dom';

// Helyi tarolo mock
const helyiTaroloMock = (() => {
  let tarolo = {};
  return {
    getItem: vi.fn((kulcs) => tarolo[kulcs] ?? null),
    setItem: vi.fn((kulcs, ertek) => { tarolo[kulcs] = String(ertek); }),
    removeItem: vi.fn((kulcs) => { delete tarolo[kulcs]; }),
    clear: vi.fn(() => { tarolo = {}; }),
    get length() { return Object.keys(tarolo).length; },
    key: vi.fn((i) => Object.keys(tarolo)[i] || null),
  };
})();

Object.defineProperty(window, 'localStorage', { value: helyiTaroloMock });

// Munkamenet tarolo mock
const munkamenetTaroloMock = (() => {
  let tarolo = {};
  return {
    getItem: vi.fn((kulcs) => tarolo[kulcs] ?? null),
    setItem: vi.fn((kulcs, ertek) => { tarolo[kulcs] = String(ertek); }),
    removeItem: vi.fn((kulcs) => { delete tarolo[kulcs]; }),
    clear: vi.fn(() => { tarolo = {}; }),
  };
})();

Object.defineProperty(window, 'sessionStorage', { value: munkamenetTaroloMock });

// Mockok torlese tesztek kozott
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks();
});