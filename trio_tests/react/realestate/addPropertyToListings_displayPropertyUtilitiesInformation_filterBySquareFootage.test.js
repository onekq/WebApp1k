import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addPropertyToListings_displayPropertyUtilitiesInformation_filterBySquareFootage';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully adds a property to the listings.', async () => {
  fetchMock.post('/api/properties', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-title'), { target: { value: 'New Property' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties').length).toEqual(1);
  expect(screen.getByText('Property added successfully')).toBeInTheDocument();
}, 10000);

test('Fails to add a property to the listings with error message.', async () => {
  fetchMock.post('/api/properties', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-title'), { target: { value: 'New Property' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties').length).toEqual(1);
  expect(screen.getByText('Failed to add property')).toBeInTheDocument();
}, 10000);

test('Successfully displays property utilities information.', async () => {
  fetchMock.get('/api/properties/1/utilities', { data: 'Utilities Information' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-utilities-button')); });

  expect(fetchMock.calls('/api/properties/1/utilities').length).toEqual(1);
  expect(screen.getByText('Utilities Information')).toBeInTheDocument();
}, 10000);

test('Fails to display property utilities information with error message.', async () => {
  fetchMock.get('/api/properties/1/utilities', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-utilities-button')); });

  expect(fetchMock.calls('/api/properties/1/utilities').length).toEqual(1);
  expect(screen.getByText('Failed to retrieve utilities information')).toBeInTheDocument();
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
