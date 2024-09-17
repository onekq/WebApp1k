import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contactPropertyOwner_filterByOpenHouses';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully contacts property owner', async () => {
  fetchMock.post('/api/contact', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('contact-message'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('contact-submit-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('contact-success')).toBeInTheDocument();
}, 10000);

test('fails to contact property owner and shows error message', async () => {
  fetchMock.post('/api/contact', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('contact-message'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('contact-submit-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('contact-error')).toBeInTheDocument();
}, 10000);

test('Filter by open houses successfully', async () => {
  fetchMock.get('/api/open-houses', { properties: [{ id: 1, name: "Open House 1" }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-open-houses-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Open House 1')).toBeInTheDocument();
}, 10000);

test('Filter by open houses fails with error', async () => {
  fetchMock.get('/api/open-houses', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-open-houses-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error filtering open houses.')).toBeInTheDocument();
}, 10000);