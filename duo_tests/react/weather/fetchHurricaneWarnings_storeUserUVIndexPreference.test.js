import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchHurricaneWarnings_storeUserUVIndexPreference';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('fetchHurricaneWarnings successfully retrieves hurricane warnings', async () => {
  fetchMock.getOnce('/api/hurricane-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Hurricane Warning' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Hurricane Warnings')); });

  expect(fetchMock.called('/api/hurricane-warnings')).toBeTruthy();
  expect(screen.getByText(/Hurricane Warning/)).toBeInTheDocument();
}, 10000);

test('fetchHurricaneWarnings fails to retrieve hurricane warnings', async () => {
  fetchMock.getOnce('/api/hurricane-warnings', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Hurricane Warnings')); });

  expect(fetchMock.called('/api/hurricane-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve hurricane warnings/)).toBeInTheDocument();
}, 10000);

test('correctly stores user UV index preference', async () => {
  fetchMock.post('/preferences/uv-index', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('uv-index-checkbox'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user UV index preference fails', async () => {
  fetchMock.post('/preferences/uv-index', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('uv-index-checkbox'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);