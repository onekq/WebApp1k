import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './deleteAllergies';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Delete allergies successfully.', async () => {
  fetchMock.delete('/api/allergies/1', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete Allergy/i)); });

  expect(fetchMock.calls('/api/allergies/1').length).toBe(1);
  expect(screen.getByText('Allergy deleted successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to delete allergies due to server error.', async () => {
  fetchMock.delete('/api/allergies/1', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete Allergy/i)); });

  expect(fetchMock.calls('/api/allergies/1').length).toBe(1);
  expect(screen.getByText('Failed to delete allergy.')).toBeInTheDocument();
}, 10000);
