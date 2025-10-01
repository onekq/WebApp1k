import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculatePropertyValue_filterByPetFriendly_propertyImageGallery';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully calculates property value.', async () => {
  fetchMock.post('/api/properties/value', { value: 500000 });

  await act(async () => { render(<MemoryRouter><CalculatePropertyValue /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-details'), { target: { value: 'Property Details' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-button')); });

  expect(fetchMock.calls('/api/properties/value').length).toEqual(1);
  expect(screen.getByText('$500,000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate property value with error message.', async () => {
  fetchMock.post('/api/properties/value', 400);

  await act(async () => { render(<MemoryRouter><CalculatePropertyValue /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-details'), { target: { value: 'Property Details' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-button')); });

  expect(fetchMock.calls('/api/properties/value').length).toEqual(1);
  expect(screen.getByText('Failed to calculate value')).toBeInTheDocument();
}, 10000);

test('Filter by pet-friendly properties successfully', async () => {
  fetchMock.get('/api/pet-friendly-properties', { properties: [{ id: 1, name: "Pet-Friendly 1" }] });

  await act(async () => { render(<MemoryRouter><PetFriendlyFilter /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-pet-friendly-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Pet-Friendly 1')).toBeInTheDocument();
}, 10000);

test('Filter by pet-friendly properties fails with error', async () => {
  fetchMock.get('/api/pet-friendly-properties', 500);

  await act(async () => { render(<MemoryRouter><PetFriendlyFilter /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-pet-friendly-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error filtering pet-friendly properties.')).toBeInTheDocument();
}, 10000);

test('displays multiple images of a property in a gallery format', async () => {
  fetchMock.get('/property/1/images', { body: [] });

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Gallery')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('imageGallery')).toBeInTheDocument();
}, 10000);

test('fails to display image gallery due to network error', async () => {
  fetchMock.get('/property/1/images', 500);

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Gallery')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load image gallery')).toBeInTheDocument();
}, 10000);
