import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateHotelCost_offerTravelTips_userPreferences';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('calculateHotelCost - calculates total hotel cost including taxes and fees', async () => {
  fetchMock.get('/api/hotels/1/cost', {
    body: { total: 200 },
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-cost-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('$200')).toBeInTheDocument();
}, 10000);

test('calculateHotelCost - shows error message when cost calculation fails', async () => {
  fetchMock.get('/api/hotels/1/cost', {
    body: { message: 'Cost Calculation Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-cost-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Cost Calculation Error')).toBeInTheDocument();
}, 10000);

test('should render travel tips and local customs information', async () => {
  fetchMock.get('/api/tips', { tips: ['Avoid peak travel times', 'Learn basic phrases'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'France' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Tips')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Avoid peak travel times')).toBeInTheDocument();
}, 10000);

test('should show error if fetching travel tips fails', async () => {
  fetchMock.get('/api/tips', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'France' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Tips')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load tips')).toBeInTheDocument();
}, 10000);

test('User preferences should be stored and applied successfully.', async () => {
  fetchMock.post('/api/user/preferences', 200);

  await act(async () => { render(<MemoryRouter><UserPreferencesComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('preference-input'), { target: { value: 'preference' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('preference-saved')).toBeInTheDocument();
}, 10000);

test('Error in storing user preferences should show error message.', async () => {
  fetchMock.post('/api/user/preferences', 500);

  await act(async () => { render(<MemoryRouter><UserPreferencesComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('preference-input'), { target: { value: 'preference' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('preference-error')).toBeInTheDocument();
}, 10000);
