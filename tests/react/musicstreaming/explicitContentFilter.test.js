import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './explicitContentFilter';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully filters explicit content', async () => {
  fetchMock.get('/api/songs?explicit=false', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('content-filter'), { target: { value: 'false' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('song-list')).toBeInTheDocument();
}, 10000);

test('fails to filter explicit content because no songs match the filter', async () => {
  fetchMock.get('/api/songs?explicit=false', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('content-filter'), { target: { value: 'false' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No explicit songs found.')).toBeInTheDocument();
}, 10000);

