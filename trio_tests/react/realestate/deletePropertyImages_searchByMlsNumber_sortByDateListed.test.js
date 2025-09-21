import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deletePropertyImages_searchByMlsNumber_sortByDateListed';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('Successfully searches by MLS number.', async () => {
  fetchMock.get('/api/properties?mls=12345', { data: { property: 'Property Data' } });

  await act(async () => { render(<MemoryRouter><SearchByMLS /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('mls-input'), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls('/api/properties?mls=12345').length).toEqual(1);
  expect(screen.getByText('Property Data')).toBeInTheDocument();
}, 10000);

test('Fails to search by MLS number with error message.', async () => {
  fetchMock.get('/api/properties?mls=12345', 400);

  await act(async () => { render(<MemoryRouter><SearchByMLS /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('mls-input'), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls('/api/properties?mls=12345').length).toEqual(1);
  expect(screen.getByText('Failed to retrieve property')).toBeInTheDocument();
}, 10000);

test('sorts property listings by the date they were listed', async () => {
  fetchMock.get('/properties?sort=date', { body: [] });

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sortDate'), { target: { value: 'desc' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitSort')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('listingResult')).toBeInTheDocument();
}, 10000);

test('fails to sort property listings by date due to network error', async () => {
  fetchMock.get('/properties?sort=date', 500);

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sortDate'), { target: { value: 'desc' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitSort')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to sort properties by date')).toBeInTheDocument();
}, 10000);
