import { render, screen } from '@testing-library/preact';
import { h } from 'preact';

function Hello() {
  return <div>Hello Jest!</div>;
}

test('renders Hello Jest!', () => {
  render(<Hello />);
  expect(screen.getByText('Hello Jest!')).toBeInTheDocument();
});