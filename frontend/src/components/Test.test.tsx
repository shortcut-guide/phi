import { render, screen } from '@testing-library/preact';
import { test, expect } from 'vitest';
import TestComponent from './Test';

test('renders Test', () => {
  render(<TestComponent name="まるまる" />);
  expect(screen.getByText('Test まるまる!')).toBeInTheDocument();
});