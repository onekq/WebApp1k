import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayPropertyApp_editPropertyDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Display property investment potential successfully', async () => {
  fetchMock.get('/api/investment-potential', { metrics: 'High' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-investment-potential-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('High')).toBeInTheDocument();
}, 10000);

test('Display property investment potential fails with error', async () => {
  fetchMock.get('/api/investment-potential', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-investment-potential-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error displaying investment potential.')).toBeInTheDocument();
}, 10000);

test('Successfully edits property details.', async () => {
  fetchMock.put('/api/properties/1', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-title'), { target: { value: 'Updated Property' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties/1').length).toEqual(1);
  expect(screen.getByText('Property updated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to edit property details with error message.', async () => {
  fetchMock.put('/api/properties/1', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-title'), { target: { value: 'Updated Property' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties/1').length).toEqual(1);
  expect(screen.getByText('Failed to update property')).toBeInTheDocument();
}, 10000);