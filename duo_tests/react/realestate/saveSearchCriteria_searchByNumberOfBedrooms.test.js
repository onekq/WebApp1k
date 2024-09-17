import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './saveSearchCriteria_searchByNumberOfBedrooms';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully saves search criteria', async () => {
  fetchMock.post('/api/search/save', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-criteria'), { target: { value: '2BHK' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-search-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('save-success')).toBeInTheDocument();
}, 10000);

test('fails to save search criteria and shows error message', async () => {
  fetchMock.post('/api/search/save', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-criteria'), { target: { value: '2BHK' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-search-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('save-error')).toBeInTheDocument();
}, 10000);

test('Search by Number of Bedrooms filters properties by number of bedrooms successfully', async () => {
  fetchMock.get('/api/properties?bedrooms=2', {
    status: 200,
    body: [{ id: 1, bedrooms: 2 }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/bedrooms/i), { target: { value: '2' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('2 bedrooms')).toBeInTheDocument();
}, 10000);

test('Search by Number of Bedrooms filters properties by number of bedrooms fails', async () => {
  fetchMock.get('/api/properties?bedrooms=2', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/bedrooms/i), { target: { value: '2' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);