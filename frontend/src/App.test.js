import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login page by default', () => {
  localStorage.clear();
  render(<App />);
  expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
});
