import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import LMSComponent from './bulkEnrollment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Bulk enrollment is successful for organizations.', async () => {
  fetchMock.post('/api/bulk-enroll', 200);

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Organization ID/i), { target: { value: 'org123' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Bulk Enroll/i)); });

  expect(fetchMock.calls('/api/bulk-enroll').length).toEqual(1);
  expect(screen.getByText(/Bulk enrollment successful/i)).toBeInTheDocument();
}, 10000);

test('Bulk enrollment fails if the server returns an error.', async () => {
  fetchMock.post('/api/bulk-enroll', 400);

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Organization ID/i), { target: { value: 'org123' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Bulk Enroll/i)); });

  expect(fetchMock.calls('/api/bulk-enroll').length).toEqual(1);
  expect(screen.getByText(/Failed to enroll users in bulk/i)).toBeInTheDocument();
}, 10000);

