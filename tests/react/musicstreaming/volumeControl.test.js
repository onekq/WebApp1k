import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './volumeControl';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Volume Control - success shows volume changed message', async () => {
  fetchMock.post('/api/set-volume', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('volume-slider'), { target: { value: '50' } }); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Volume set to 50')).toBeInTheDocument();
}, 10000);

test('Volume Control - failure shows error message', async () => {
  fetchMock.post('/api/set-volume', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('volume-slider'), { target: { value: '50' } }); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to change volume')).toBeInTheDocument();
}, 10000);

