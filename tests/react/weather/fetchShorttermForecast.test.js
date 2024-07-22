import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchShorttermForecast';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('FetchShorttermForecast - retrieves short-term forecast successfully', async () => {
  fetchMock.get('/api/short-term-forecast', {
    body: { forecast: 'Short Term: Clear' },
    status: 200
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Short Term Forecast'));
  });

  expect(fetchMock.calls('/api/short-term-forecast').length).toBe(1);
  expect(screen.getByText('Short Term: Clear')).toBeInTheDocument();
}, 10000);

test('FetchShorttermForecast - fails to retrieve short-term forecast', async () => {
  fetchMock.get('/api/short-term-forecast', {
    body: { error: 'Failed to fetch data' },
    status: 500
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Short Term Forecast'));
  });

  expect(fetchMock.calls('/api/short-term-forecast').length).toBe(1);
  expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
}, 10000);

