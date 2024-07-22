import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import PropertyUtilitiesInfo from './displayPropertyUtilitiesInformation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully displays property utilities information.', async () => {
  fetchMock.get('/api/properties/1/utilities', { data: 'Utilities Information' });

  await act(async () => { render(<MemoryRouter><PropertyUtilitiesInfo /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-utilities-button')); });

  expect(fetchMock.calls('/api/properties/1/utilities').length).toEqual(1);
  expect(screen.getByText('Utilities Information')).toBeInTheDocument();
}, 10000);

test('Fails to display property utilities information with error message.', async () => {
  fetchMock.get('/api/properties/1/utilities', 400);

  await act(async () => { render(<MemoryRouter><PropertyUtilitiesInfo /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-utilities-button')); });

  expect(fetchMock.calls('/api/properties/1/utilities').length).toEqual(1);
  expect(screen.getByText('Failed to retrieve utilities information')).toBeInTheDocument();
}, 10000);