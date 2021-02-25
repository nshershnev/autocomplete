import { render, screen } from '@testing-library/react';
import App from './App';

test('renders search input element', () => {
  render(<App />);

  const inputElement = screen.getByTestId('search-input');
  expect(inputElement).toBeInTheDocument();
});
