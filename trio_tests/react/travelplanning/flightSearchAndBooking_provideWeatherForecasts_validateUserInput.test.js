import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './flightSearchAndBooking_provideWeatherForecasts_validateUserInput';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('SearchFlights - search flights successfully', async () => {
  fetchMock.get('/api/flights?origin=JFK&destination=LAX&date=2023-10-15', {
    flights: [{ id: 1, airline: 'Delta', price: 200, duration: '5h' }]
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Origin'), { target: { value: 'JFK' } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Destination'), { target: { value: 'LAX' } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2023-10-15' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Delta')).toBeInTheDocument();
}, 10000);

test('SearchFlights - search flights fails with error message', async () => {
  fetchMock.get('/api/flights?origin=JFK&destination=LAX&date=2023-10-15', { throws: new Error('Failed to fetch flights') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Origin'), { target: { value: 'JFK' } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Destination'), { target: { value: 'LAX' } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2023-10-15' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch flights')).toBeInTheDocument();
}, 10000);

test('should render weather forecasts for travel dates', async () => {
  fetchMock.get('/api/weather', { weather: ['Sunny', 'Rainy'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter travel dates'), { target: { value: '2023-12-25' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sunny')).toBeInTheDocument();
}, 10000);

test('should show error if fetching weather forecasts fails', async () => {
  fetchMock.get('/api/weather', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter travel dates'), { target: { value: '2023-12-25' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load weather forecasts')).toBeInTheDocument();
}, 10000);

test('User input data should be validated successfully.', async () => {
  fetchMock.post('/api/user/validate', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('input-data'), { target: { value: 'valid-data' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-input')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('validation-success')).toBeInTheDocument();
}, 10000);

test('Error in user input data validation should show error message.', async () => {
  fetchMock.post('/api/user/validate', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('input-data'), { target: { value: 'invalid-data' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-input')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('validation-error')).toBeInTheDocument();
}, 10000);
