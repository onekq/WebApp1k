import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ProjectManagementApp from './projectAssignment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Assign Users to Project - success', async () => {
  fetchMock.post('/api/projects/assign-users', 200);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/users/i), { target: { value: 'User1, User2' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /assign users/i }));
  });

  expect(fetchMock.calls('/api/projects/assign-users')).toHaveLength(1);
  expect(screen.getByText(/users assigned successfully/i)).toBeInTheDocument();
}, 10000);

test('Assign Users to Project - failure', async () => {
  fetchMock.post('/api/projects/assign-users', 400);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/users/i), { target: { value: 'User1, User2' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /assign users/i }));
  });

  expect(fetchMock.calls('/api/projects/assign-users')).toHaveLength(1);
  expect(screen.getByText(/failed to assign users/i)).toBeInTheDocument();
}, 10000);

