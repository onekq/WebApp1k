import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import DeleteProperty from './deletePropertyFromListings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

