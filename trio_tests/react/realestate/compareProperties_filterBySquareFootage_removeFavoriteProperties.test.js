import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './compareProperties_filterBySquareFootage_removeFavoriteProperties';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully compares properties', async () => {
  fetchMock.post('/api/properties/compare', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('compare-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('comparison-result')).toBeInTheDocument();
}, 10000);

test('fails to compare properties and shows error message', async () => {
  fetchMock.post('/api/properties/compare', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('compare-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('comparison-error')).toBeInTheDocument();
}, 10000);

test('Filter by Square Footage filters properties by their square footage successfully', async () => {
  fetchMock.get('/api/properties?sqft=1000', {
    status: 200,
    body: [{ id: 1, sqft: 1000 }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/square footage/i), { target: { value: '1000' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('1000 sqft')).toBeInTheDocument();
}, 10000);

test('Filter by Square Footage filters properties by their square footage fails', async () => {
  fetchMock.get('/api/properties?sqft=1000', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/square footage/i), { target: { value: '1000' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);

test('successfully removes favorite properties', async () => {
  fetchMock.post('/api/favorites/remove', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-favorite-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('remove-confirmation')).toBeInTheDocument();
}, 10000);

test('fails to remove favorite properties and shows error message', async () => {
  fetchMock.post('/api/favorites/remove', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-favorite-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('remove-error')).toBeInTheDocument();
}, 10000);
