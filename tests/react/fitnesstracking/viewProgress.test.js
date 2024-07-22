import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ViewProgressGraph from './viewProgress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should successfully view a graphical progress representation', async () => {
  fetchMock.get('/api/progress/graph', { status: 200, body: {} });

  await act(async () => {
    render(<MemoryRouter><ViewProgressGraph /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/progress chart/i)).toBeInTheDocument();
}, 10000);

test('should show error message when viewing a graphical progress representation fails', async () => {
  fetchMock.get('/api/progress/graph', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><ViewProgressGraph /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to load progress/i)).toBeInTheDocument();
}, 10000);