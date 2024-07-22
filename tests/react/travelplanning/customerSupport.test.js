import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CustomerSupportComponent from './customerSupport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Customer support options should be provided successfully.', async () => {
  fetchMock.get('/api/support/options', [{ id: 1, method: 'Phone' }]);

  await act(async () => { render(<MemoryRouter><CustomerSupportComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('get-support-options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('support-options')).toBeInTheDocument();
}, 10000);

test('Error in offering customer support should show error message.', async () => {
  fetchMock.get('/api/support/options', 500);

  await act(async () => { render(<MemoryRouter><CustomerSupportComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('get-support-options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('support-error')).toBeInTheDocument();
}, 10000);