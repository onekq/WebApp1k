import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchShorttermForecast_fetchWeatherByZIPCode_fetchWeekendForecast';

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

test('Fetch weather by ZIP code succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { zip: '10001', temperature: 15 } });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('zip-input'), { target: { value: '10001' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 15')).toBeInTheDocument();
}, 10000);

test('Fetch weather by ZIP code fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('zip-input'), { target: { value: '00000' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('ZIP code not found')).toBeInTheDocument();
}, 10000);

test('FetchWeekendForecast - retrieves weekend forecast successfully', async () => {
  fetchMock.get('/api/weekend-forecast', {
    body: { forecast: 'Weekend: Sunny' },
    status: 200
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Weekend Forecast'));
  });

  expect(fetchMock.calls('/api/weekend-forecast').length).toBe(1);
  expect(screen.getByText('Weekend: Sunny')).toBeInTheDocument();
}, 10000);

test('FetchWeekendForecast - fails to retrieve weekend forecast', async () => {
  fetchMock.get('/api/weekend-forecast', {
    body: { error: 'Failed to fetch data' },
    status: 500
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Weekend Forecast'));
  });

  expect(fetchMock.calls('/api/weekend-forecast').length).toBe(1);
  expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
}, 10000);
