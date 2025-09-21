import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByOpenHouses_saveFavoriteProperties_viewContactFormStatus';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Filter by open houses successfully', async () => {
  fetchMock.get('/api/open-houses', { properties: [{ id: 1, name: "Open House 1" }] });

  await act(async () => { render(<MemoryRouter><OpenHouseFilter /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-open-houses-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Open House 1')).toBeInTheDocument();
}, 10000);

test('Filter by open houses fails with error', async () => {
  fetchMock.get('/api/open-houses', 500);

  await act(async () => { render(<MemoryRouter><OpenHouseFilter /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-open-houses-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error filtering open houses.')).toBeInTheDocument();
}, 10000);

test('successfully saves favorite properties', async () => {
  fetchMock.post('/api/favorites', 200);

  await act(async () => { render(<MemoryRouter><SaveFavoriteProperties /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-favorite-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('favorite-confirmation')).toBeInTheDocument();
}, 10000);

test('fails to save favorite properties and shows error message', async () => {
  fetchMock.post('/api/favorites', 500);

  await act(async () => { render(<MemoryRouter><SaveFavoriteProperties /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-favorite-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('favorite-error')).toBeInTheDocument();
}, 10000);

test('successfully shows contact form status', async () => {
  fetchMock.post('/api/contact/status', 200);

  await act(async () => { render(<MemoryRouter><ViewContactFormStatus /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-status-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('status-success')).toBeInTheDocument();
}, 10000);

test('fails to show contact form status and shows error message', async () => {
  fetchMock.post('/api/contact/status', 500);

  await act(async () => { render(<MemoryRouter><ViewContactFormStatus /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-status-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('status-error')).toBeInTheDocument();
}, 10000);
