import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByAmenities_mapIntegration_viewSimilarProperties';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Filter by Amenities filters properties by amenities successfully', async () => {
  fetchMock.get('/api/properties?amenities=pool', {
    status: 200,
    body: [{ id: 1, amenities: ['pool'] }]
  });

  await act(async () => render(<MemoryRouter><PropertySearch /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/amenities/i), { target: { value: 'pool' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('pool')).toBeInTheDocument();
}, 10000);

test('Filter by Amenities filters properties by amenities fails', async () => {
  fetchMock.get('/api/properties?amenities=pool', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><PropertySearch /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/amenities/i), { target: { value: 'pool' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);

test('shows the property location on a map', async () => {
  fetchMock.get('/property/1/location', { body: {} });

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Map')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('propertyMap')).toBeInTheDocument();
}, 10000);

test('fails to display property location on map due to network error', async () => {
  fetchMock.get('/property/1/location', 500);

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Map')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load property map')).toBeInTheDocument();
}, 10000);

test('View similar properties successfully', async () => {
  fetchMock.get('/api/similar-properties', { properties: [{ id: 1, name: "Prop 1" }] });

  await act(async () => { render(<MemoryRouter><SimilarProperties /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-similar-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Prop 1')).toBeInTheDocument();
}, 10000);

test('View similar properties fails with error', async () => {
  fetchMock.get('/api/similar-properties', 500);

  await act(async () => { render(<MemoryRouter><SimilarProperties /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-similar-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error loading similar properties.')).toBeInTheDocument();
}, 10000);
