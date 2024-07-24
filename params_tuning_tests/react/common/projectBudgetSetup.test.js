import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ProjectManagementApp from './projectBudgetSetup';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Set Project Budget - success', async () => {
  fetchMock.post('/api/projects/budget', 200);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/budget amount/i), { target: { value: '1000' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /set budget/i }));
  });

  expect(fetchMock.calls('/api/projects/budget')).toHaveLength(1);
  expect(screen.getByText(/budget set successfully/i)).toBeInTheDocument();
}, 10000);

test('Set Project Budget - failure', async () => {
  fetchMock.post('/api/projects/budget', 400);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/budget amount/i), { target: { value: '1000' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /set budget/i }));
  });

  expect(fetchMock.calls('/api/projects/budget')).toHaveLength(1);
  expect(screen.getByText(/failed to set budget/i)).toBeInTheDocument();
}, 10000);

