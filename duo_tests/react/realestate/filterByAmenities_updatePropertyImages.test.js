import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByAmenities_updatePropertyImages';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filter by Amenities filters properties by amenities successfully', async () => {
  fetchMock.get('/api/properties?amenities=pool', {
    status: 200,
    body: [{ id: 1, amenities: ['pool'] }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
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

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/amenities/i), { target: { value: 'pool' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);

test('Successfully updates property images.', async () => {
  fetchMock.put('/api/properties/1/images/1', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('image-upload'), { target: { files: [new File([], 'updated-image.jpg')] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties/1/images/1').length).toEqual(1);
  expect(screen.getByText('Image updated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to update property images with error message.', async () => {
  fetchMock.put('/api/properties/1/images/1', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('image-upload'), { target: { files: [new File([], 'updated-image.jpg')] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties/1/images/1').length).toEqual(1);
  expect(screen.getByText('Failed to update image')).toBeInTheDocument();
}, 10000);