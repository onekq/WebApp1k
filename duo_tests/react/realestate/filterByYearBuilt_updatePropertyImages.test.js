import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByYearBuilt_updatePropertyImages';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filter by Year Built filters properties by the year they were built successfully', async () => {
  fetchMock.get('/api/properties?yearBuilt=2010', {
    status: 200,
    body: [{ id: 1, yearBuilt: 2010 }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/year built/i), { target: { value: '2010' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Built in 2010')).toBeInTheDocument();
}, 10000);

test('Filter by Year Built filters properties by the year they were built fails', async () => {
  fetchMock.get('/api/properties?yearBuilt=2010', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/year built/i), { target: { value: '2010' } }));
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