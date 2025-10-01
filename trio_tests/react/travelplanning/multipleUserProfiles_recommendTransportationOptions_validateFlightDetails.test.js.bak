import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './multipleUserProfiles_recommendTransportationOptions_validateFlightDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Multiple user profiles should be managed successfully.', async () => {
  fetchMock.get('/api/user/profiles', [{ id: 1, name: 'John Doe' }]);

  await act(async () => { render(<MemoryRouter><UserProfileComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('get-profiles')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('profiles-list')).toBeInTheDocument();
}, 10000);

test('Error in managing user profiles should show error message.', async () => {
  fetchMock.get('/api/user/profiles', 404);

  await act(async () => { render(<MemoryRouter><UserProfileComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('get-profiles')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('profiles-error')).toBeInTheDocument();
}, 10000);

test('should render recommended transportation options at the destination', async () => {
  fetchMock.get('/api/transportation', { transportation: ['Rental Car', 'Metro'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'New York' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Transportation Options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Rental Car')).toBeInTheDocument();
}, 10000);

test('should show error if fetching transportation options fails', async () => {
  fetchMock.get('/api/transportation', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'New York' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Transportation Options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load transportation options')).toBeInTheDocument();
}, 10000);

test('ValidateFlightDetails - validate flight details successfully', async () => {
  fetchMock.post('/api/validate-flight', { valid: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Flight Details')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Flight details are valid')).toBeInTheDocument();
}, 10000);

test('ValidateFlightDetails - validate flight details fails with error message', async () => {
  fetchMock.post('/api/validate-flight', { valid: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Flight Details')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Flight details are not valid')).toBeInTheDocument();
}, 10000);
