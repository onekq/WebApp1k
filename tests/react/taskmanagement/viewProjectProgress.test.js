import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ProjectManagementApp from './viewProjectProgress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('View Project Progress - success', async () => {
  fetchMock.get('/api/projects/progress', 200);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /view progress/i }));
  });

  expect(fetchMock.calls('/api/projects/progress')).toHaveLength(1);
  expect(screen.getByText(/project progress/i)).toBeInTheDocument();
}, 10000);

test('View Project Progress - failure', async () => {
  fetchMock.get('/api/projects/progress', 400);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /view progress/i }));
  });

  expect(fetchMock.calls('/api/projects/progress')).toHaveLength(1);
  expect(screen.getByText(/failed to load project progress/i)).toBeInTheDocument();
}, 10000);

