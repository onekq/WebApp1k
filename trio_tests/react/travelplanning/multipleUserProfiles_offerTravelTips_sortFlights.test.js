import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './multipleUserProfiles_offerTravelTips_sortFlights';

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

test('SortFlights - sort flights by price successfully', async () => {
  fetchMock.get('/api/flights?sort=price', {
    flights: [{ id: 1, airline: 'Delta', price: 200, duration: '5h' }]
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Sort By'), { target: { value: 'price' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Sort')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Delta')).toBeInTheDocument();
}, 10000);

test('SortFlights - sort flights by price fails with error message', async () => {
  fetchMock.get('/api/flights?sort=price', { throws: new Error('Failed to sort flights') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Sort By'), { target: { value: 'price' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Sort')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort flights')).toBeInTheDocument();
}, 10000);
