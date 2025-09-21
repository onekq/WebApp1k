import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addPropertyToListings_deletePropertyImages_displayPropertyTaxInformation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully adds a property to the listings.', async () => {
  fetchMock.post('/api/properties', { success: true });

  await act(async () => { render(<MemoryRouter><AddProperty /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-title'), { target: { value: 'New Property' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties').length).toEqual(1);
  expect(screen.getByText('Property added successfully')).toBeInTheDocument();
}, 10000);

test('Fails to add a property to the listings with error message.', async () => {
  fetchMock.post('/api/properties', 400);

  await act(async () => { render(<MemoryRouter><AddProperty /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-title'), { target: { value: 'New Property' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties').length).toEqual(1);
  expect(screen.getByText('Failed to add property')).toBeInTheDocument();
}, 10000);

test('Successfully deletes property images.', async () => {
  fetchMock.delete('/api/properties/1/images/1', { success: true });

  await act(async () => { render(<MemoryRouter><DeletePropertyImages /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-image-button')); });

  expect(fetchMock.calls('/api/properties/1/images/1').length).toEqual(1);
  expect(screen.getByText('Image deleted successfully')).toBeInTheDocument();
}, 10000);

test('Fails to delete property images with error message.', async () => {
  fetchMock.delete('/api/properties/1/images/1', 400);

  await act(async () => { render(<MemoryRouter><DeletePropertyImages /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-image-button')); });

  expect(fetchMock.calls('/api/properties/1/images/1').length).toEqual(1);
  expect(screen.getByText('Failed to delete image')).toBeInTheDocument();
}, 10000);

test('shows property tax details for a listing', async () => {
  fetchMock.get('/property/1/tax', { body: {} });

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Tax')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('taxInfo')).toBeInTheDocument();
}, 10000);

test('fails to display property tax information due to network error', async () => {
  fetchMock.get('/property/1/tax', 500);

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Tax')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load property tax information')).toBeInTheDocument();
}, 10000);
