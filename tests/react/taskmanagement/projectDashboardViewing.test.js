import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ProjectManagementApp from './projectDashboardViewing';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('View Project Dashboard - success', async () => {
  fetchMock.get('/api/projects/dashboard', 200);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /view dashboard/i }));
  });

  expect(fetchMock.calls('/api/projects/dashboard')).toHaveLength(1);
  expect(screen.getByText(/project dashboard/i)).toBeInTheDocument();
}, 10000);

test('View Project Dashboard - failure', async () => {
  fetchMock.get('/api/projects/dashboard', 400);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /view dashboard/i }));
  });

  expect(fetchMock.calls('/api/projects/dashboard')).toHaveLength(1);
  expect(screen.getByText(/failed to load dashboard/i)).toBeInTheDocument();
}, 10000);

