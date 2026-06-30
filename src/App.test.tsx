import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home hero content', () => {
  render(<App />);
  expect(screen.getByText(/您的健康/i)).toBeInTheDocument();
  expect(screen.getByText(/Diet Plan/i)).toBeInTheDocument();
});
