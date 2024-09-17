import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customerSupport_recommendRestaurants';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Customer support options should be provided successfully.', async () => {
  fetchMock.get('/api/support/options', [{ id: 1, method: 'Phone' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('get-support-options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('support-options')).toBeInTheDocument();
}, 10000);

test('Error in offering customer support should show error message.', async () => {
  fetchMock.get('/api/support/options', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('get-support-options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('support-error')).toBeInTheDocument();
}, 10000);

test('should render recommended restaurants at the destination', async () => {
  fetchMock.get('/api/restaurants', { restaurants: ['French Bistro', 'Sushi Place'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Tokyo' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Restaurants')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('French Bistro')).toBeInTheDocument();
}, 10000);

test('should show error if fetching recommended restaurants fails', async () => {
  fetchMock.get('/api/restaurants', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Tokyo' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Restaurants')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load restaurants')).toBeInTheDocument();
}, 10000);