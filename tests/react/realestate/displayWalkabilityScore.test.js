import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import WalkabilityScore from './displayWalkabilityScore';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Display walkability score successfully', async () => {
  fetchMock.get('/api/walkability-score', { score: 85 });

  await act(async () => { render(<MemoryRouter><WalkabilityScore /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-walkability-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('85')).toBeInTheDocument();
}, 10000);

test('Display walkability score fails with error', async () => {
  fetchMock.get('/api/walkability-score', 500);

  await act(async () => { render(<MemoryRouter><WalkabilityScore /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-walkability-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error displaying walkability score.')).toBeInTheDocument();
}, 10000);

