import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contactPropertyOwner_deletePropertyFromListings_searchByPropertyOwner';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully contacts property owner', async () => {
  fetchMock.post('/api/contact', 200);

  await act(async () => { render(<MemoryRouter><ContactPropertyOwner /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('contact-message'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('contact-submit-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('contact-success')).toBeInTheDocument();
}, 10000);

test('fails to contact property owner and shows error message', async () => {
  fetchMock.post('/api/contact', 500);

  await act(async () => { render(<MemoryRouter><ContactPropertyOwner /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('contact-message'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('contact-submit-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('contact-error')).toBeInTheDocument();
}, 10000);

test('Successfully deletes a property from the listings.', async () => {
  fetchMock.delete('/api/properties/1', { success: true });

  await act(async () => { render(<MemoryRouter><DeleteProperty /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/api/properties/1').length).toEqual(1);
  expect(screen.getByText('Property deleted successfully')).toBeInTheDocument();
}, 10000);

test('Fails to delete a property from the listings with error message.', async () => {
  fetchMock.delete('/api/properties/1', 400);

  await act(async () => { render(<MemoryRouter><DeleteProperty /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/api/properties/1').length).toEqual(1);
  expect(screen.getByText('Failed to delete property')).toBeInTheDocument();
}, 10000);

test('Search by property owner successfully', async () => {
  fetchMock.get('/api/properties-by-owner', { properties: [{ id: 1, owner: "Owner 1" }] });

  await act(async () => { render(<MemoryRouter><PropertyOwnerSearch /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('owner-search-input'), { target: { value: 'Owner 1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-by-owner-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Owner 1')).toBeInTheDocument();
}, 10000);

test('Search by property owner fails with error', async () => {
  fetchMock.get('/api/properties-by-owner', 500);

  await act(async () => { render(<MemoryRouter><PropertyOwnerSearch /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('owner-search-input'), { target: { value: 'Owner 1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-by-owner-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error searching properties by owner.')).toBeInTheDocument();
}, 10000);
