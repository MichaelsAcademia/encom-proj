// This file runs before each Jest test suite so we can register shared helpers.
import '@testing-library/jest-dom'; // Adds user-friendly DOM matchers (e.g., toBeInTheDocument).

// 2. Polyfill TextEncoder and TextDecoder
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextEncoder, TextDecoder });