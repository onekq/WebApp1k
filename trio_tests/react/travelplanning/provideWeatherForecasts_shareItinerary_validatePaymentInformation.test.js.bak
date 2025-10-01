import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './provideWeatherForecasts_shareItinerary_validatePaymentInformation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('successfully shares an itinerary with other users.', async () => {
  fetchMock.post('/api/share-itinerary', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('share-input'), { target: { value: 'user@example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-itinerary-button')); });

  expect(fetchMock.calls('/api/share-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Itinerary shared')).toBeInTheDocument();
}, 10000);

test('fails to share itinerary due to invalid email.', async () => {
  fetchMock.post('/api/share-itinerary', { status: 400, body: { error: 'Invalid email address' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('share-input'), { target: { value: 'invalid-email' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-itinerary-button')); });

  expect(fetchMock.calls('/api/share-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Invalid email address')).toBeInTheDocument();
}, 10000);

test('Valid payment information should be processed successfully.', async () => {
  fetchMock.post('/api/payment', 200);

  await act(async () => { render(<MemoryRouter><PaymentComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('card-number'), { target: { value: '1234567890123456' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-payment')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Invalid payment information should show error message.', async () => {
  fetchMock.post('/api/payment', 400);

  await act(async () => { render(<MemoryRouter><PaymentComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('card-number'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-payment')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
